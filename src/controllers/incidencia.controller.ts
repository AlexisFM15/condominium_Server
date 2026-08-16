import { Context } from 'koa'
import {
  createIncidenciaSchema,
  updateIncidenciaSchema,
  incidenciaParamsSchema,
} from '../schemas/incidencia.schema.js'
import { incidenciaService } from '../services/incidencia.service.js'

// CREATE
export const createIncidencia = async (ctx: Context) => {
  const result = createIncidenciaSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const incidencia = incidenciaService.create({
      title: result.data.title,
      description: result.data.description,
      condominium: { id: result.data.condominiumId },
      reportedBy: { id: ctx.state.user.id },
    })
    await incidenciaService.save(incidencia)

    ctx.status = 201
    ctx.body = incidencia
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getIncidencias = async (ctx: Context) => {
  try {
    const incidencias = await incidenciaService.find({
      relations: ['condominium', 'reportedBy'],
    })
    ctx.body = incidencias
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getIncidenciaById = async (ctx: Context) => {
  const params = incidenciaParamsSchema.parse(ctx.params)

  try {
    const incidencia = await incidenciaService.findOne({
      where: { id: params.id },
      relations: ['condominium', 'reportedBy'],
    })

    if (!incidencia) {
      ctx.throw(404, 'incidencia not found')
    }

    ctx.body = incidencia
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updateIncidencia = async (ctx: Context) => {
  const params = incidenciaParamsSchema.parse(ctx.params)

  try {
    const result = updateIncidenciaSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const incidencia = await incidenciaService.findOne({
      where: { id: params.id },
    })

    if (!incidencia) {
      ctx.throw(404, 'incidencia not found')
    }

   const updateData: Partial<typeof incidencia> = {}
    if (result.data.title !== undefined) updateData.title = result.data.title
    if (result.data.description !== undefined) updateData.description = result.data.description
    if (result.data.status !== undefined) updateData.status = result.data.status

    incidenciaService.merge(incidencia, updateData)

    await incidenciaService.save(incidencia)
    ctx.body = incidencia
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deleteIncidencia = async (ctx: Context) => {
  const params = incidenciaParamsSchema.parse(ctx.params)

  try {
    const incidencia = await incidenciaService.findOne({
      where: { id: params.id },
    })

    if (!incidencia) {
      ctx.throw(404, 'incidencia not found')
    }

    await incidenciaService.softRemove(incidencia)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}