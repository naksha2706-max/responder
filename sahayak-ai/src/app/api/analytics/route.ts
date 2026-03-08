import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');

    if (!institutionId) {
      return NextResponse.json(
        { error: 'Institution ID is required' },
        { status: 400 }
      );
    }

    // Mock analytics data - in production, aggregate from DynamoDB
    const mockAnalytics = {
      riskScore: 67,
      heatmapData: {
        hostel_a: { count: 12, severity: 'high' },
        hostel_b: { count: 4, severity: 'medium' },
        cse_dept: { count: 8, severity: 'high' },
        ece_dept: { count: 3, severity: 'low' },
        library: { count: 2, severity: 'low' },
        common_areas: { count: 6, severity: 'medium' },
        cafeteria: { count: 1, severity: 'low' },
        sports_complex: { count: 0, severity: 'safe' }
      },
      crisisBreakdown: {
        ragging: 67,
        harassment: 21,
        mental_health: 9,
        cyberbullying: 3
      },
      clusterAlerts: [
        {
          id: 1,
          location: 'hostel_a',
          type: 'ragging',
          count: 3,
          timeframe: '48 hours',
          recommendation: 'Convene anti-ragging cell today'
        },
        {
          id: 2,
          location: 'cse_dept',
          type: 'harassment',
          count: 4,
          timeframe: '24 hours',
          recommendation: 'ICC investigation required'
        }
      ],
      patternInsights: [
        'Ragging incidents peak between 11pm and 2am',
        'Hostel A has 3x the incident rate of Hostel B',
        'CSE department harassment cases increased 40% this month',
        'Mental health cases spike during exam periods'
      ],
      peakTimes: {
        hours: [0, 2, 1, 0, 0, 0, 1, 2, 3, 4, 6, 8, 12, 15, 18, 14, 10, 8, 6, 4, 3, 2, 4, 6],
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        dayData: [8, 12, 15, 18, 22, 14, 6]
      }
    };

    return NextResponse.json(mockAnalytics);

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}