import { AxiosInstance } from 'axios';
import { HttpException } from '../../exceptions/HttpException';
import { Language } from './language.interface';
import { getWatchURL } from './settings';
import TranscriptParser from './TranscriptParser';

class Transcript {
  private axiosInstance;
  private videoId;
  private url;
  private language;
  private isGenerated;
  private translationLanguages;

  constructor(
    axiosInstance: AxiosInstance,
    videoId: string,
    url: string,
    language: Language,
    isGenerated: boolean,
    translationLanguages: Language[]
  ) {
    this.axiosInstance = axiosInstance;
    this.videoId = videoId;
    this.url = url;
    this.language = language;
    this.isGenerated = isGenerated;
    this.translationLanguages = translationLanguages;
  }

  public fetch = async () => {
    const response = await this.axiosInstance.get(this.url);
    return TranscriptParser.parse(response.data);
  };
}

export default Transcript;
