import axios from 'axios';
import VideoFetcher from '../modules/youtube-transcribe/VideoFetcher';
import { HttpException } from '../exceptions/HttpException';
import TranscriptList from '../modules/youtube-transcribe/TranscriptList';
import { TranscriptLanguage } from '../modules/youtube-transcribe/language.interface';
import Transcript from '..//modules/youtube-transcribe/Transcript';

class TranscribeService {
  private transcriptList;
  private videoFetcher;
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
    this.transcriptList = new TranscriptList(this.axiosInstance);
    this.videoFetcher = new VideoFetcher(this.axiosInstance);
  }

  public getTranscriptAndAvailableLangs = async (videoId: string) => {
    const video = await this.videoFetcher.fetch(videoId);
    const transcriptList = video.getTranscriptList();

    // English by default. If not found, the first entry is used
    const foundTranscript = await transcriptList.findTranscript([
      'en',
      'en-GB',
    ]);

    if (!foundTranscript) {
      throw new HttpException(500, 'The requested video is not translatable');
    }

    const transcript = await foundTranscript.fetch();

    return {
      videoDetails: video.getVideoDetails(),
      subs: transcript,
      availableLangs: transcriptList.getAvailableLanguagesAsObj(),
      language: foundTranscript.getLanguage().language,
    };
  };

  // Doesn't require video fetcher again
  public getTranslatedTranscript = async (language: TranscriptLanguage) => {
    const transcript = await new Transcript(
      this.axiosInstance,
      language.videoId,
      language.url,
      language.language,
      false // for now it's using only manual captions
    ).fetch();

    return {
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
