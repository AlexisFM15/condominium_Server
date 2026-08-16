import { Context } from 'koa'
import {
  createBuildingSchema,
  updateBuildingSchema,
  buildingParamsSchema,
} from '../schemas/building.schema.js'
import { buildingService } from '../services/building.service.js'
import { Building } from '../models/building.model.js'
import { condominiumService } from '../services/condominum.service.js'

// CREATE
export const createBuilding = async (ctx: Context) => {
  const result = createBuildingSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const building = buildingService.create({
      name: result.data.name,
      description: result.data.description ?? '',
      condominium: { id: result.data.condominiumId },
    })
    await buildingService.save(building)

    ctx.status = 201
    ctx.body = building
  } catch (error) {
    ctx.status = 500
    console.log(error)
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getBuildings = async (ctx: Context) => {
  try {
    const buildings = await buildingService.find({
      relations: ['condominium'],
    })

    ctx.body = buildings
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getBuildingById = async (ctx: Context) => {
  const params = buildingParamsSchema.parse(ctx.params)

  try {
    const building = await buildingService.findOne({
      where: { id: params.id },
      relations: ['condominium'],
    })

    if (!building) {
      ctx.throw(404, 'building not found')
    }

    ctx.body = building
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE

export const updateBuilding = async (ctx: Context) => {
  const params = buildingParamsSchema.parse(ctx.params)

  try {
    const result = updateBuildingSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const building = await buildingService.findOne({
      where: { id: params.id },
      relations: ['condominium'],
    })

    if (!building) {
      ctx.throw(404, 'Building not found')
    }

    const { condominiumId, ...buildingData } = result.data

    buildingService.merge(building, buildingData as Partial<Building>)

    if (condominiumId) {
      const condominium = await condominiumService.findOne({
        where: { id: condominiumId },
      })

      if (!condominium) {
        ctx.throw(404, 'Condominium not found')
      }

      building.condominium = condominium
    }

    await buildingService.save(building)

    ctx.body = building
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = {
      message: 'Error connecting to the server',
    }
  }
}
// DELETE (soft delete)
export const deleteBuilding = async (ctx: Context) => {
  const params = buildingParamsSchema.parse(ctx.params)

  try {
    const building = await buildingService.findOne({
      where: { id: params.id },
    })

    if (!building) {
      ctx.throw(404, 'building not found')
    }

    await buildingService.softRemove(building)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}
