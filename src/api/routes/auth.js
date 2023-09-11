import { Router } from "express";

import UserService from "../../services/user.js";
import urls from "../urls.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema } from "../middlewares/validate.js";
import {
  registerSchema,
  changePasswordSchema,
  loginSchema,
} from "../schemas/auth.js";

const router = Router();

router.post(urls.auth.login, requireSchema(loginSchema), async (req, res) => {
  const { email, password } = req.validatedBody;

  const user = await UserService.authenticateWithPassword(email, password);

  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ error: "Authentication failed" });
  }
});

router.get(urls.auth.login, (req, res) => {
  res.status(405).json({ error: "Login with POST instead" });
});

router.post(
  urls.auth.register,
  requireSchema(registerSchema),
  async (req, res, next) => {
    if (req.user) {
      res.json({ user: req.user });
      return;
    }

    try {
      const user = await UserService.createUser(req.validatedBody);
      res.status(201).json({ user });
    } catch (error) {
      if (error.isClientError()) {
        res.status(400).json({ error });
      } else {
        next(error);
      }
    }
  }
);

// all auth routes after this can rely on existence of req.user
router.use(requireUser);

router.post(urls.auth.logout, async (req, res) => {
  await UserService.regenerateToken(req.user);
  res.status(204).send();
});

router.get(urls.auth.logout, (req, res) => {
  res.status(405).json({ error: "Logout with POST instead" });
});

router.post(
  urls.auth.changePassword,
  requireSchema(changePasswordSchema),
  async (req, res) => {
    const { password } = req.validatedBody;

    await UserService.setPassword(req.user, password.toString());
    res.status(204).send();
  }
);

export default router;
