import axios from "axios";
import { Youtube } from "lucide-react";
import { YoutubeTranscript } from 'youtube-transcript';

export async function searchYouTube(searchQuery: string) {
    searchQuery = searchQuery.replaceAll(" ", "+");
    console.count("youtube search");
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`,
      {
        method: "GET",
      }
    );
    const json = await response.json();
    if (!json) {
      console.log("youtube fail");
      return null;
    }
    if (json.items[0] == undefined) {
      console.log("youtube fail");
      return null;
    }
    return json.items[0].id.videoId;
  }
   
export async function getTranscript(videoId : string){
    try {
        let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
            lang : "en",
            country : "EN",
        });
        let transcript = ''
        for ( let t of transcript_arr) {
            transcript += t.text + ' '
        }
        return transcript.replaceAll('\n', '')
    } catch (error) {
        return '';

    }
}