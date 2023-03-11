import { NextFunction, Request, Response } from 'express';
import TranscribeService from '../services/transcribe.service';

class TranscribeController {
  private transcribeService = new TranscribeService();

  public getTranscript = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const transcript = await this.transcribeService.getTranscript(
        '1lOd7rDFYbc'
      );
      res.status(200).json(transcript);
    } catch (error) {
      next(error);
    }
  };
}

export default TranscribeController;
