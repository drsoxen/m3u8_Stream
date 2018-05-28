# Video Streamer

currently using https://www.npmjs.com/package/hls-server#producing-streams




#BRL change in ViperPlayerController
~~~~~~~~
if (m_pPlayer->GetPlayerState() == CYIAbstractVideoPlayer::MEDIA_UNLOADED) 
{ 
    m_pPlayer->Prepare(m_videoUrl, GetAbstractStreamingFormat(m_eFormat)); 
}
~~~~~~~~

To:

~~~~~~~~
if (m_pPlayer->GetPlayerState() == CYIAbstractVideoPlayer::MEDIA_UNLOADED) 
{
    m_pPlayer->Prepare(CYIUrl("http://localhost:8000/live/localStream/index.m3u8"), GetAbstractStreamingFormat(m_eFormat)); 
}
~~~~~~~~


#A complete "VOD" .m3u8

~~~~~~~~
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:12
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:10.427778,
index0.ts
#EXTINF:11.679111,
index1.ts
#EXTINF:7.925111,
index2.ts
#EXT-X-ENDLIST
~~~~~~~~

#A currently streaming "live" .m3u8

~~~~~~~~
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:12
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:10.427778,
index0.ts
#EXTINF:11.679111,
index1.ts	
~~~~~~~~