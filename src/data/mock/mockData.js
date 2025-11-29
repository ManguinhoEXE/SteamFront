export const mockUser = {
  id: 1,
  name: '<Nombre del Usuario>',
  balance: 20000
};

export const mockBalances = Array(6).fill(null).map((_, index) => ({
  id: index + 1,
  amount: 20000
}));

export const mockHistorial = Array(5).fill(null).map((_, index) => ({
  id: index + 1,
  game: 'GTA V',
  amount: 70000,
  date: new Date().toISOString()
}));

export const mockDepositos = Array(8).fill(null).map((_, index) => ({
  id: index + 1,
  amount: 10000,
  date: 'dd/mes/año'
}));
