// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import JadwalPage from './page';
// import * as XLSX from 'xlsx';

// // Create a strongly-typed mock for Supabase
// const mockSupabase = {
//   from: jest.fn().mockReturnThis(),
//   select: jest.fn().mockReturnThis(),
//   order: jest.fn().mockReturnThis(),
// };

// // Mock the supabase client with proper typing
// jest.mock('../../lib/supabaseClient', () => ({
//   supabase: mockSupabase,
// }));

// // Mock react-to-print
// jest.mock('react-to-print', () => ({
//   useReactToPrint: jest.fn(() => jest.fn()),
// }));

// // Mock xlsx
// jest.mock('xlsx', () => ({
//   utils: {
//     json_to_sheet: jest.fn(),
//     book_new: jest.fn(),
//     book_append_sheet: jest.fn(),
//   },
//   writeFile: jest.fn(),
// }));

// describe('JadwalPage', () => {
//   const mockJadwalData = [
//     { no: 1, nama: 'Bapak Joko', waktu: '08:00 - 09:00', pengajar: 'Guru A' },
//     { no: 2, nama: 'Ibu Susi', waktu: '09:00 - 10:00', pengajar: 'Guru B' },
//   ];

//   beforeEach(() => {
//     jest.clearAllMocks();
    
//     // Setup mock implementation
//     mockSupabase.from.mockImplementation(() => mockSupabase);
//     mockSupabase.select.mockImplementation(() => mockSupabase);
//     mockSupabase.order.mockImplementation(() => ({
//       data: mockJadwalData,
//       error: null,
//     }));

//     // Mock date
//     jest.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('Selasa, 1 Januari 2024');
//   });

//   it('renders loading state initially', async () => {
//     render(<JadwalPage />);
//     expect(screen.getByText('Memuat data...')).toBeInTheDocument();
//     await waitFor(() => expect(screen.queryByText('Memuat data...')).not.toBeInTheDocument());
//   });

//   it('fetches and displays jadwal data', async () => {
//     render(<JadwalPage />);

//     await waitFor(() => {
//       expect(mockSupabase.from).toHaveBeenCalledWith('jadwal');
//       expect(mockSupabase.select).toHaveBeenCalledWith('no, nama, waktu, pengajar');
//       expect(mockSupabase.order).toHaveBeenCalledWith('no', { ascending: true });

//       mockJadwalData.forEach((item) => {
//         expect(screen.getByText(item.nama)).toBeInTheDocument();
//         expect(screen.getByText(item.waktu)).toBeInTheDocument();
//         expect(screen.getByText(item.pengajar)).toBeInTheDocument();
//       });
//     });
//   });

//   it('handles Excel export', async () => {
//     render(<JadwalPage />);
//     await waitFor(() => expect(screen.queryByText('Memuat data...')).not.toBeInTheDocument());

//     fireEvent.click(screen.getByText('Ekspor Excel 📊'));

//     expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(mockJadwalData);
//     expect(XLSX.writeFile).toHaveBeenCalled();
//   });
// });