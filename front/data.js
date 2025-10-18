// Dataset local (fallback) para popular seções e, opcionalmente, a capa.
// Fonte de imagens: TMDB CDN. Para uso em produção com a API do TMDB, é necessário uma API key e atribuição.
// Este arquivo define window.APP_DATA para ser consumido por index.js.

window.APP_DATA = {
  hero: [
    {
      title: 'Oppenheimer',
      description: 'A épica história do físico J. Robert Oppenheimer e o desenvolvimento da bomba atômica.',
      image: 'https://movies.universalpictures.com/media/04-opp-dm-mobile-banner-1080x745-pl-f01-050523-1-1-1-6458870c70c1d-1.jpg'
    },
    {
      title: 'Peaky Blinders',
      description: 'Peaky Blinders é uma série de televisão britânica de drama que se estabeleceu como um fenômeno cultural global.',
      image: 'https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/02/Peaky-Blinders-Cast-and-Character-Guide.jpg'
    },
    {
      title: 'Vingadores: Guerra Infinita',
      description: 'Os Vingadores enfrentam Thanos em uma batalha pelo destino do universo.',
      image: 'https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg'
    }
  ],
  sections: [
    {
      id: 'trending',
      title: 'Em Alta',
      items: [
        { title: 'Avatar: O Caminho da Água', year: '2022', rating: '7.6', image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
        { title: 'Top Gun: Maverick', year: '2022', rating: '8.3', image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg' },
        { title: 'John Wick 4: Baba Yaga', year: '2023', rating: '7.7', image: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg' },
        { title: 'Homem-Aranha: Sem Volta Para Casa', year: '2021', rating: '8.2', image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg' },
        { title: 'Doutor Estranho 2', year: '2022', rating: '6.9', image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg' }
      ]
    },
    {
      id: 'toprated',
      title: 'Mais Bem Avaliados',
      items: [
        { title: 'O Senhor dos Anéis: O Retorno do Rei', year: '2003', rating: '9.0', image: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg' },
        { title: 'Batman: O Cavaleiro das Trevas', year: '2008', rating: '9.0', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
        { title: 'Duna', year: '2021', rating: '8.0', image: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg' },
        { title: 'Parasita', year: '2019', rating: '8.5', image: 'https://image.tmdb.org/t/p/w500/igw938inb6Fy0YVcwIyxQ7Lu5FO.jpg' },
        { title: 'Interestelar', year: '2014', rating: '8.6', image: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg' }
      ]
    },
    {
      id: 'upcoming',
      title: 'Em Breve',
      items: [
        { title: 'Duna: Parte Dois', year: '2024', rating: '—', image: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg' },
        { title: 'Coringa 2', year: '2024', rating: '—', image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
        { title: 'Gladiador II', year: '2024', rating: '—', image: 'https://image.tmdb.org/t/p/w500/vPVxF6hQ5e0MyoVo2QbY4Z1cdqG.jpg' },
        { title: 'Deadpool 3', year: '2024', rating: '—', image: 'https://image.tmdb.org/t/p/w500/EnDlndEvw6Ptpp8HIwmVcHVGq4k.jpg' },
        { title: 'Avatar 3', year: '2025', rating: '—', image: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg' }
      ]
    }
  ]
};
