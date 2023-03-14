import axios from 'axios';
import VideoFetcher from '../modules/youtube-transcribe/VideoFetcher';
import { HttpException } from '../exceptions/HttpException';
import TranscriptList from '../modules/youtube-transcribe/TranscriptList';

class TranscribeService {
  private transcriptList;
  private videoFetcher;

  constructor() {
    this.transcriptList = new TranscriptList(axios.create());
    this.videoFetcher = new VideoFetcher(axios.create());
  }

  public getTranscriptWithDetails = async (
    videoId: string,
    languages: string[] = ['en']
  ) => {
    const video = await this.videoFetcher.fetch(videoId);
    const foundTranscript = await video
      .getTranscriptList()
      .findTranscript(['en']);

    if (!foundTranscript) {
      throw new HttpException(
        500,
        'The requested language is not translatable'
      );
    }

    const transcript = await foundTranscript.fetch();

    return {
      videoDetails: video.getVideoDetails(),
      subs: transcript,
    };
  };

  // Get available transcripts for a video
  public getTranscriptList = async (videoId: string) => {
    const transciptList = await this.transcriptList.fetch(videoId);
    return transciptList;
  };
}

export default TranscribeService;
