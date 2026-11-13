import type { Request, RequestHandler } from 'express';
import { UnauthorizedError } from '../../common/errors/AppError';
import { created, ok } from '../../common/utils/response';
import {
  createPersonnelSchema,
  updatePersonnelProfileSchema,
} from './personnel.schemas';
import * as personnelService from './personnel.service';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new UnauthorizedError();
  }
  return req.user.id;
}

export const getMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile = await personnelService.getMyProfile(requireUserId(req));
    ok(res, profile, 'Personnel profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const input = updatePersonnelProfileSchema.parse(req.body);
    const profile = await personnelService.updateMyProfile(
      requireUserId(req),
      input,
    );
    ok(res, profile, 'Personnel profile updated successfully');
  } catch (err) {
    next(err);
  }
};

export const provisionPersonnel: RequestHandler = async (req, res, next) => {
  try {
    const input = createPersonnelSchema.parse(req.body);
    const profile = await personnelService.provisionPersonnel(input);
    created(res, profile, 'Personnel account provisioned successfully');
  } catch (err) {
    next(err);
  }
};
