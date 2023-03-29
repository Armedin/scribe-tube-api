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

  constructor(
    axiosInstance: AxiosInstance,
    videoId: string,
    url: string,
    language: Language,
    isGenerated: boolean
  ) {
    this.axiosInstance = axiosInstance;
    this.videoId = videoId;
    this.url = url;
    this.language = language;
    this.isGenerated = isGenerated;
  }

  public fetch = async () => {
    const response = await this.axiosInstance.get(this.url);
    return TranscriptParser.parse(response.data);
  };

  public getLanguage = () => {
    return this.language;
  };
}

export default Transcript;
