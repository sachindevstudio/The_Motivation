/**
 * Daily.co Integration Service Abstraction (DEMO MODE & Production Architecture)
 * 
 * In production:
 * This layer calls your secure server-side endpoint (/api/daily/rooms) which talks
 * to Daily.co REST APIs using your DAILY_API_KEY. It consumes Webhooks for
 * participant joined/left/ended events to prevent client-side tampering.
 * 
 * In this MVP Demo:
 * Cleanly simulates room creation, meeting link generation, and live participant telemetry.
 */

export interface DailyRoomConfig {
  name?: string;
  privacy?: 'public' | 'private';
  properties?: {
    exp?: number;
    max_participants?: number;
    enable_chat?: boolean;
    enable_screenshare?: boolean;
    start_video_off?: boolean;
    start_audio_off?: boolean;
  };
}

export interface DailyRoomResponse {
  id: string;
  name: string;
  url: string;
  created_at: string;
  isSimulated: boolean;
}

export class DailyVideoService {
  private static BASE_DOMAIN = 'themotivation.daily.co';

  /**
   * Creates a meeting room. In production, this would make an authenticated HTTP POST
   * to Daily.co room API via a backend proxy.
   */
  public static async createMeeting(
    therapyName: string,
    sessionType: 'individual' | 'group',
    sessionId: string
  ): Promise<DailyRoomResponse> {
    const slug = `${therapyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${sessionType}-${sessionId.slice(-6)}`;
    const url = `https://${this.BASE_DOMAIN}/${slug}`;

    return {
      id: `room-${sessionId}`,
      name: slug,
      url,
      created_at: new Date().toISOString(),
      isSimulated: true // Clearly flagged as DEMO MODE
    };
  }

  /**
   * Generates a direct student invite link.
   */
  public static generateMeetingLink(roomUrl: string, studentName?: string): string {
    if (!studentName) return roomUrl;
    const cleanName = encodeURIComponent(studentName);
    return `${roomUrl}?userName=${cleanName}`;
  }

  /**
   * Helper to format seconds into MM:SS or HH:MM:SS
   */
  public static formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
