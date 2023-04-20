import { NextFunction, Request, Response } from 'express';
import { TranscriptLanguage } from '../modules/youtube-transcribe/language.interface';
import TranscribeService from '../services/transcribe.service';

class TranscribeController {
  private transcribeService = new TranscribeService();

  public getInfo = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ status: 'ok' });
  };

  public getTranscript = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const transcript =
        await this.transcribeService.getTranscriptAndAvailableLangs(
          req.body.id
        );
      res.status(200).json(transcript);
    } catch (error) {
      next(error);
    }
  };

  public switchLanguage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const language: TranscriptLanguage = req.body.language;
      const transcript = await this.transcribeService.getTranslatedTranscript(
        language
      );

      res.status(200).json(transcript);
    } catch (error) {
      next(error);
    }
  };
}

export default TranscribeController;
