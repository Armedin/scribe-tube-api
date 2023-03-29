import { AxiosInstance } from 'axios';
import { HttpException } from '../../exceptions/HttpException';
import { Language } from './language.interface';
import { getWatchURL } from './settings';
import Transcript from './Transcript';

class TranscriptList {
  private axiosInstance;
  private videoId;
  private manualTranscripts;
  private generatedTranscripts;
  private translationLanguages;

  constructor(
    axiosInstance: AxiosInstance,
    videoId?: string,
    manualTranscripts?: any,
    generatedTranscripts?: any,
    translationLanguages?: Language[]
  ) {
    this.axiosInstance = axiosInstance;
    this.videoId = videoId;
    this.manualTranscripts = manualTranscripts;
    this.generatedTranscripts = generatedTranscripts;
    this.translationLanguages = translationLanguages;
  }

  public fetch = async (videoId: string) => {
    const response = await this.axiosInstance.get(getWatchURL(videoId));
    return this.build(videoId, this.extractCaptionsFromHTML(response.data));
  };

  public build = (
    videoId: string,
    captions: any // json
  ) => {
    const translationLanguages: Language[] = captions[
      'translationLanguages'
    ].map((item: any) => ({
      language: item.languageName.simpleText,
      code: item.languageCode,
    }));

    const manualTranscripts: any = {};
    const generatedTranscripts: any = {};

    captions['captionTracks'].map((caption: any) => {
      const languageCode = caption['languageCode'];
      const transcript = new Transcript(
        this.axiosInstance,
        videoId,
        caption['baseUrl'],
        {
          language: caption['name']['simpleText'],
          code: languageCode,
        },
        caption.kind && caption.kind === 'asr'
      );

      if (caption.kind && caption.kind === 'asr') {
        generatedTranscripts[languageCode] = transcript;
      } else {
        manualTranscripts[languageCode] = transcript;
      }
    });

    return new TranscriptList(
      this.axiosInstance,
      videoId,
      manualTranscripts,
      generatedTranscripts,
      translationLanguages
    );
  };

  // Find a transcript given the language code (desc order of priority)
  public findTranscript = (
    languageCodes: string[]
  ): Promise<Transcript | null> => {
    const allTranscriptList = [
      this.manualTranscripts,
      // this.generatedTranscripts, // for now using only manual
    ];

    let foundTranscript = null;

    for (let i = 0; i < languageCodes.length; i++) {
      allTranscriptList.some(transcriptList => {
        if (transcriptList.hasOwnProperty(languageCodes[i])) {
          foundTranscript = transcriptList[languageCodes[i]];
          return true;
        }
      });

      if (foundTranscript) {
        break;
      }
    }

    // Find the first available language
    if (!foundTranscript) {
      allTranscriptList.some(transcriptList => {
        if (Object.keys(transcriptList).length > 0) {
          foundTranscript = transcriptList[Object.keys(transcriptList)[0]];
          return true;
        }
      });
    }

    return foundTranscript;
  };

  public getAvailableLanguagesAsObj = () => {
    return {
      manualTranscript: this.manualTranscripts,
      generatedTranscripts: this.generatedTranscripts,
    };
  };

  private extractCaptionsFromHTML = (html: string) => {
    const splittedHTML = html.split('"captions":');

    if (splittedHTML.length <= 1) {
      if (html.includes('class="g-recaptcha"')) {
        throw new HttpException(500, 'Too many requests');
      }

      if (!html.includes('"playabilityStatus":')) {
        throw new HttpException(500, 'Video unavailable');
      }

      throw new HttpException(500, 'Subtitles are disabled for this video');
    }

    const captionsJSON = JSON.parse(splittedHTML[1].split(',"videoDetails')[0])[
      'playerCaptionsTracklistRenderer'
    ];

    if (!captionsJSON) {
      throw new HttpException(404, 'Subtitles are disabled for this video');
    }

    return captionsJSON;
  };
}

export default TranscriptList;
