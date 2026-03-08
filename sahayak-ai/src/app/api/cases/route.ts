import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');
    const role = searchParams.get('role');

    if (!institutionId || !role) {
      return NextResponse.json(
        { error: 'Institution ID and role are required' },
        { status: 400 }
      );
    }

    // Mock cases data - in production, fetch from DynamoDB
    const mockCases = [
      {
        id: 'SAH-CASE-001',
        type: 'harassment',
        severity: 'high',
        status: 'Under Review',
        date: '2026-03-01',
        followUpStatus: 'worse',
        isAnonymous: true,
        priority: true,
        sessionId: 'sess_001',
        description: 'Workplace harassment incident reported',
        location: 'CSE Department',
        reportedBy: 'Anonymous'
      },
      {
        id: 'SAH-CASE-002',
        type: 'ragging',
        severity: 'medium',
        status: 'Action Taken',
        date: '2026-02-28',
        followUpStatus: 'better',
        isAnonymous: false,
        priority: false,
        sessionId: 'sess_002',
        description: 'Ragging incident in hostel',
        location: 'Hostel A',
        reportedBy: 'Student Name'
      }
    ];

    // Filter cases based on role permissions
    const rolePermissions = {
      icc_officer: ['harassment', 'sexual_harassment'],
      anti_ragging_warden: ['ragging', 'bullying'],
      campus_counsellor: ['mental_health', 'counseling'],
      dean: ['all'],
      security_officer: ['physical_threat', 'emergency']
    };

    const permissions = rolePermissions[role as keyof typeof rolePermissions] || [];
    
    let filteredCases = mockCases;
    if (!permissions.includes('all')) {
      filteredCases = mockCases.filter(case_ => permissions.includes(case_.type));
    }

    return NextResponse.json({ cases: filteredCases });

  } catch (error) {
    console.error('Cases API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { caseId, status, updatedBy } = await request.json();

    if (!caseId || !status || !updatedBy) {
      return NextResponse.json(
        { error: 'Case ID, status, and updatedBy are required' },
        { status: 400 }
      );
    }

    // Mock update - in production, update DynamoDB
    const updateData = {
      caseId,
      status,
      updatedBy,
      updatedAt: new Date().toISOString()
    };

    console.log('Case updated:', updateData);

    return NextResponse.json({ success: true, data: updateData });

  } catch (error) {
    console.error('Case update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}