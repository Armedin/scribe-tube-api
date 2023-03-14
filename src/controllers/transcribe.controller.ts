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
      const transcript = await this.transcribeService.getTranscriptWithDetails(
        req.body.id
      );
      res.status(200).json(transcript);
    } catch (error) {
      next(error);
    }
  };
}

export default TranscribeController;
