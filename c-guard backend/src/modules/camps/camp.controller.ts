import type { RequestHandler } from 'express';
import { z } from 'zod';
import { created, ok } from '../../common/utils/response';
import {
  createCampSchema,
  listCampsQuerySchema,
  updateCampSchema,
} from './camp.schemas';
import * as campService from './camp.service';

export const listCamps: RequestHandler = async (req, res, next) => {
  try {
    const filters = listCampsQuerySchema.parse(req.query);
    const camps = await campService.listCamps(filters);
    ok(res, camps, 'Camps retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getCamp: RequestHandler = async (req, res, next) => {
  try {
    const campId = z.uuid().parse(req.params.id);
    const camp = await campService.getCamp(campId);
    ok(res, camp, 'Camp retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createCamp: RequestHandler = async (req, res, next) => {
  try {
    const input = createCampSchema.parse(req.body);
    const camp = await campService.createCamp(input);
    created(res, camp, 'Camp created successfully');
  } catch (err) {
    next(err);
  }
};

export const updateCamp: RequestHandler = async (req, res, next) => {
  try {
    const campId = z.uuid().parse(req.params.id);
    const input = updateCampSchema.parse(req.body);
    const camp = await campService.updateCamp(campId, input);
    ok(res, camp, 'Camp updated successfully');
  } catch (err) {
    next(err);
  }
};
