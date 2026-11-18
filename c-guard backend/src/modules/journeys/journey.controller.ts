import type { Request, RequestHandler } from 'express';
import { z } from 'zod';
import { UnauthorizedError } from '../../common/errors/AppError';
import { created, ok } from '../../common/utils/response';
import {
  createJourneySchema,
  listJourneysQuerySchema,
} from './journey.schemas';
import * as journeyService from './journey.service';

function requireUser(req: Request) {
  if (!req.user) {
    throw new UnauthorizedError();
  }
  return req.user;
}

export const createJourney: RequestHandler = async (req, res, next) => {
  try {
    const input = createJourneySchema.parse(req.body);
    const journey = await journeyService.createJourney(requireUser(req), input);
    created(res, journey, 'Journey registered successfully');
  } catch (err) {
    next(err);
  }
};

export const listJourneys: RequestHandler = async (req, res, next) => {
  try {
    const filters = listJourneysQuerySchema.parse(req.query);
    const journeys = await journeyService.listJourneys(requireUser(req), filters);
    ok(res, journeys, 'Journeys retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getActiveJourney: RequestHandler = async (req, res, next) => {
  try {
    const journey = await journeyService.getActiveJourney(requireUser(req));
    ok(res, journey, 'Active journey retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getJourney: RequestHandler = async (req, res, next) => {
  try {
    const journeyId = z.uuid().parse(req.params.id);
    const journey = await journeyService.getJourney(requireUser(req), journeyId);
    ok(res, journey, 'Journey retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const startJourney: RequestHandler = async (req, res, next) => {
  try {
    const journeyId = z.uuid().parse(req.params.id);
    const journey = await journeyService.startJourney(requireUser(req), journeyId);
    ok(res, journey, 'Journey started successfully');
  } catch (err) {
    next(err);
  }
};

export const endJourney: RequestHandler = async (req, res, next) => {
  try {
    const journeyId = z.uuid().parse(req.params.id);
    const journey = await journeyService.endJourney(requireUser(req), journeyId);
    ok(res, journey, 'Journey completed successfully');
  } catch (err) {
    next(err);
  }
};

export const cancelJourney: RequestHandler = async (req, res, next) => {
  try {
    const journeyId = z.uuid().parse(req.params.id);
    const journey = await journeyService.cancelJourney(
      requireUser(req),
      journeyId,
    );
    ok(res, journey, 'Journey cancelled successfully');
  } catch (err) {
    next(err);
  }
};
