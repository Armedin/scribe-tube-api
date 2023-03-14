import { AxiosInstance } from 'axios';
import { getWatchURL } from './settings';
import TranscriptList from './TranscriptList';
import { HttpException } from '../../exceptions/HttpException';

class VideoFetcher {
  private axiosInstance;
  private videoId;
  private transcriptList;
  private videoDetails;

  constructor(
    axiosInstance: AxiosInstance,
    videoId?: string,
    transcriptList?: TranscriptList,
    videoDetails?: any
  ) {
    this.axiosInstance = axiosInstance;
    this.videoId = videoId;
    this.transcriptList = transcriptList;
    this.videoDetails = videoDetails;
  }

  public fetch = async (videoId: string) => {
    const response = await this.axiosInstance.get(getWatchURL(videoId));
    return this.build(videoId, response.data);
  };

  private build = (videoId: string, html: string) => {
    const splittedHTML = html.split('"videoDetails":');
    // TODO - check for length
    const videoDetails = JSON.parse(
      splittedHTML[1].split(',"playerConfig"')[0]
    );

    return new VideoFetcher(
      this.axiosInstance,
      videoId,
      new TranscriptList(this.axiosInstance).build(
        videoId,
        this.extractCaptionsFromHTML(html)
      ),
      videoDetails
    );
  };

  public getTranscriptList = () => {
    return this.transcriptList;
  };

  public getVideoDetails = () => {
    return this.videoDetails;
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

export default VideoFetcher;
