import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import TranscribeController from '../controllers/transcribe.controller';

class TranscibeRoute implements Routes {
  public path = '/transcribe';
  public router = Router();
  public transcibeController = new TranscribeController();

  constructor() {
    this.router.post(`${this.path}/`, this.transcibeController.getTranscript);
    this.router.get(`${this.path}/`, this.transcibeController.getInfo);

    this.router.post(
      `${this.path}/change-language`,
      this.transcibeController.switchLanguage
    );
  }
}

export default TranscibeRoute;
