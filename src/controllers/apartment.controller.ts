import { Context } from 'koa'
import {
  createApartmentSchema,
  updateApartmentSchema,
  apartmentParamsSchema,
} from '../schemas/apartment.schema.js'
import { apartmentService } from '../services/apartment.service.js'
import { Apartment } from '../models/apartment.model.js'
import { occupancyType } from '../utils/enums.js'

// CREATE
export const createApartment = async (ctx: Context) => {
  const result = createApartmentSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const apartment = apartmentService.create({
      number: result.data.number,
      occupancyType: result.data.occupancyType || occupancyType.VACANT,
      building: { id: result.data.buildingId },
      user: result.data.userId ? { id: result.data.userId } : {},
    })
    await apartmentService.save(apartment)

    ctx.status = 201
    ctx.body = apartment
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getApartments = async (ctx: Context) => {
  try {
    const apartments = await apartmentService.find({
      relations: ['building'],
    })

    ctx.body = apartments
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getApartmentById = async (ctx: Context) => {
  const params = apartmentParamsSchema.parse(ctx.params)

  try {
    const apartment = await apartmentService.findOne({
      where: { id: params.id },
      relations: ['building'],
    })

    if (!apartment) {
      ctx.throw(404, 'apartment not found')
    }

    ctx.body = apartment
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updateApartment = async (ctx: Context) => {
  const params = apartmentParamsSchema.parse(ctx.params)

  try {
    const result = updateApartmentSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const apartment = await apartmentService.findOne({
      where: { id: params.id },
    })

    if (!apartment) {
      ctx.throw(404, 'apartment not found')
    }

    apartmentService.merge(apartment, result.data as Partial<Apartment>)
    await apartmentService.save(apartment)

    ctx.body = apartment
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deleteApartment = async (ctx: Context) => {
  const params = apartmentParamsSchema.parse(ctx.params)

  try {
    const apartment = await apartmentService.findOne({
      where: { id: params.id },
    })

    if (!apartment) {
      ctx.throw(404, 'apartment not found')
    }

    await apartmentService.softRemove(apartment)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}
