import axios from 'axios';
import { HttpException } from '../exceptions/HttpException';
import TranscriptList from '../modules/youtube-transcribe/TranscriptList';

class TranscribeService {
  private transcriptList;

  constructor() {
    this.transcriptList = new TranscriptList(axios.create());
  }

  public getTranscript = async (
    videoId: string,
    languages: string[] = ['en']
  ) => {
    const transciptList = await this.transcriptList.fetch(videoId);
    const transcript = await transciptList.findTranscript(['en']);

    if (!transcript) {
      throw new HttpException(
        500,
        'The requested language is not translatable'
      );
    }

    return await transcript.fetch();
  };

  // Get available transcripts for a video
  public getTranscriptList = async (videoId: string) => {
    const transciptList = await this.transcriptList.fetch(videoId);
    return transciptList;
  };
}

export default TranscribeService;
