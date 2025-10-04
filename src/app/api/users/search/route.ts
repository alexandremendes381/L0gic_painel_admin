import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.trim() === '') {
      return NextResponse.json([]);
    }
    
    // TODO: Implementar busca no banco de dados
    // const searchTerm = query.toLowerCase().trim();
    // const filteredUsers = await searchUsersInDatabase(searchTerm);
    
    return NextResponse.json([]);
  } catch (err) {
    console.error('Erro na busca de usuários:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}