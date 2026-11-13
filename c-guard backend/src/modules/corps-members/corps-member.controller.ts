import type { Request, RequestHandler } from 'express';
import { z } from 'zod';
import { UnauthorizedError } from '../../common/errors/AppError';
import { created, ok } from '../../common/utils/response';
import {
  assignCampSchema,
  createEmergencyContactSchema,
  updateCorpsMemberProfileSchema,
  updateEmergencyContactSchema,
} from './corps-member.schemas';
import * as corpsMemberService from './corps-member.service';

function requireUserId(req: Request): string {
  if (!req.user) {
    throw new UnauthorizedError();
  }
  return req.user.id;
}

export const getMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile = await corpsMemberService.getMyProfile(requireUserId(req));
    ok(res, profile, 'Corps member profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const input = updateCorpsMemberProfileSchema.parse(req.body);
    const profile = await corpsMemberService.updateMyProfile(
      requireUserId(req),
      input,
    );
    ok(res, profile, 'Corps member profile updated successfully');
  } catch (err) {
    next(err);
  }
};

export const listMyEmergencyContacts: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const contacts = await corpsMemberService.listMyEmergencyContacts(
      requireUserId(req),
    );
    ok(res, contacts, 'Emergency contacts retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createMyEmergencyContact: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const input = createEmergencyContactSchema.parse(req.body);
    const contact = await corpsMemberService.createMyEmergencyContact(
      requireUserId(req),
      input,
    );
    created(res, contact, 'Emergency contact created successfully');
  } catch (err) {
    next(err);
  }
};

export const updateMyEmergencyContact: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const contactId = z.uuid().parse(req.params.id);
    const input = updateEmergencyContactSchema.parse(req.body);
    const contact = await corpsMemberService.updateMyEmergencyContact(
      requireUserId(req),
      contactId,
      input,
    );
    ok(res, contact, 'Emergency contact updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteMyEmergencyContact: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const contactId = z.uuid().parse(req.params.id);
    await corpsMemberService.deleteMyEmergencyContact(
      requireUserId(req),
      contactId,
    );
    ok(res, null, 'Emergency contact deleted successfully');
  } catch (err) {
    next(err);
  }
};

export const assignCamp: RequestHandler = async (req, res, next) => {
  try {
    const userId = z.uuid().parse(req.params.userId);
    const input = assignCampSchema.parse(req.body);
    const profile = await corpsMemberService.assignCorpsMemberCamp(userId, input);
    ok(res, profile, 'Corps member camp assigned successfully');
  } catch (err) {
    next(err);
  }
};
