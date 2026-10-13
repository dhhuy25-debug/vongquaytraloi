import { Student, Question } from '../types';

// Helper to create cute colorful SVG avatar Data URLs for Elementary Students
export function makeCuteAvatarSvg(type: number): string {
  const configs = [
    // 0: Cậu bé mũ vàng tươi vui
    { bg: '#E0F2FE', skin: '#FCD34D', hair: '#78350F', cloth: '#0284C7', cap: '#F59E0B', eye: '#1E293B', accessory: 'cap' },
    // 1: Cô bé tóc thắt bím nơ hồng
    { bg: '#FCE7F3', skin: '#FDE68A', hair: '#451A03', cloth: '#EC4899', cap: '#F43F5E', eye: '#1E293B', accessory: 'ribbon' },
    // 2: Cậu bé kính cận thông thái
    { bg: '#DCFCE7', skin: '#FCD34D', hair: '#1E293B', cloth: '#10B981', cap: '#3B82F6', eye: '#1E293B', accessory: 'glasses' },
    // 3: Cô bé cài tai thỏ dễ thương
    { bg: '#FEF3C7', skin: '#FDE68A', hair: '#92400E', cloth: '#F59E0B', cap: '#EC4899', eye: '#1E293B', accessory: 'bunny' },
    // 4: Cậu bé áo khủng long tím
    { bg: '#EDE9FE', skin: '#FCD34D', hair: '#3B0764', cloth: '#8B5CF6', cap: '#10B981', eye: '#1E293B', accessory: 'star' },
    // 5: Cô bé cột tóc đuôi ngựa nơ đỏ
    { bg: '#FFE4E6', skin: '#FDE68A', hair: '#713F12', cloth: '#FB7185', cap: '#F43F5E', eye: '#1E293B', accessory: 'bow' },
    // 6: Cậu bé đeo tai nghe thể thao
    { bg: '#E0E7FF', skin: '#FCD34D', hair: '#172554', cloth: '#4F46E5', cap: '#EF4444', eye: '#1E293B', accessory: 'headphone' },
    // 7: Cô bé cài hoa hướng dương
    { bg: '#CCFBF1', skin: '#FDE68A', hair: '#3E2723', cloth: '#14B8A6', cap: '#F59E0B', eye: '#1E293B', accessory: 'flower' },
    // 8: Cậu bé mũ beret họa sĩ
    { bg: '#FEF9C3', skin: '#FCD34D', hair: '#292524', cloth: '#EA580C', cap: '#D97706', eye: '#1E293B', accessory: 'cap' },
    // 9: Cô bé bím tóc song sinh
    { bg: '#F3E8FF', skin: '#FDE68A', hair: '#581C87', cloth: '#A855F7', cap: '#EC4899', eye: '#1E293B', accessory: 'ribbon' },
    // 10: Cậu bé siêu nhân năng động
    { bg: '#CFFAFE', skin: '#FCD34D', hair: '#0F172A', cloth: '#06B6D4', cap: '#F43F5E', eye: '#1E293B', accessory: 'star' },
    // 11: Cô bé mắt cười ngây thơ
    { bg: '#FEE2E2', skin: '#FDE68A', hair: '#854D0E', cloth: '#EF4444', cap: '#F59E0B', eye: '#1E293B', accessory: 'bow' },
  ];

  const c = configs[type % configs.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="${c.bg}" stroke="#ffffff" stroke-width="3"/>
    <path d="M22 95 C22 75, 78 75, 78 95 Z" fill="${c.cloth}"/>
    <path d="M42 75 L50 82 L58 75 Z" fill="#ffffff"/>
    <circle cx="50" cy="50" r="28" fill="${c.skin}"/>
    <path d="M25 45 C25 22, 75 22, 75 45 C75 32, 25 32, 25 45 Z" fill="${c.hair}"/>
    <circle cx="28" cy="46" r="6" fill="${c.hair}"/>
    <circle cx="72" cy="46" r="6" fill="${c.hair}"/>
    <ellipse cx="36" cy="58" rx="4" ry="2" fill="#F87171" opacity="0.45"/>
    <ellipse cx="64" cy="58" rx="4" ry="2" fill="#F87171" opacity="0.45"/>
    <circle cx="40" cy="50" r="3.2" fill="${c.eye}"/>
    <circle cx="41.2" cy="48.8" r="1.1" fill="#ffffff"/>
    <circle cx="60" cy="50" r="3.2" fill="${c.eye}"/>
    <circle cx="61.2" cy="48.8" r="1.1" fill="#ffffff"/>
    <path d="M43 59 Q50 67 57 59" stroke="#9A3412" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    ${
      c.accessory === 'cap'
        ? `<path d="M25 36 C25 22, 75 22, 75 36 Z" fill="${c.cap}"/><path d="M22 36 L78 36 L85 41 L20 41 Z" fill="${c.cap}"/><circle cx="50" cy="22" r="3.5" fill="#EF4444"/>`
        : ''
    }
    ${
      c.accessory === 'glasses'
        ? `<rect x="31" y="44" width="16" height="12" rx="4" fill="none" stroke="#2563EB" stroke-width="2.2"/><rect x="53" y="44" width="16" height="12" rx="4" fill="none" stroke="#2563EB" stroke-width="2.2"/><line x1="47" y1="50" x2="53" y2="50" stroke="#2563EB" stroke-width="2.2"/>`
        : ''
    }
    ${
      c.accessory === 'bunny'
        ? `<ellipse cx="37" cy="18" rx="4.5" ry="11" fill="#FFFFFF" stroke="#EC4899" stroke-width="1.8"/><ellipse cx="37" cy="18" rx="2.5" ry="7" fill="#F472B6"/><ellipse cx="63" cy="18" rx="4.5" ry="11" fill="#FFFFFF" stroke="#EC4899" stroke-width="1.8"/><ellipse cx="63" cy="18" rx="2.5" ry="7" fill="#F472B6"/><rect x="33" y="27" width="34" height="4" rx="2" fill="#EC4899"/>`
        : ''
    }
    ${
      c.accessory === 'ribbon'
        ? `<circle cx="23" cy="28" r="8" fill="${c.cap}"/><circle cx="77" cy="28" r="8" fill="${c.cap}"/><circle cx="23" cy="28" r="4" fill="#ffffff"/><circle cx="77" cy="28" r="4" fill="#ffffff"/>`
        : ''
    }
    ${
      c.accessory === 'star'
        ? `<path d="M50 14 L52 20 L58 20 L53 24 L55 30 L50 26 L45 30 L47 24 L42 20 L48 20 Z" fill="#FBBF24"/>`
        : ''
    }
    ${
      c.accessory === 'bow'
        ? `<path d="M68 25 L78 20 L78 30 Z" fill="#F43F5E"/><path d="M68 25 L58 20 L58 30 Z" fill="#F43F5E"/><circle cx="68" cy="25" r="3" fill="#FFE4E6"/>`
        : ''
    }
    ${
      c.accessory === 'headphone'
        ? `<path d="M22 50 C22 25, 78 25, 78 50" fill="none" stroke="#EF4444" stroke-width="4"/><rect x="18" y="44" width="7" height="13" rx="3.5" fill="#EF4444"/><rect x="75" y="44" width="7" height="13" rx="3.5" fill="#EF4444"/>`
        : ''
    }
    ${
      c.accessory === 'flower'
        ? `<circle cx="30" cy="28" r="4" fill="#EC4899"/><circle cx="36" cy="28" r="4" fill="#EC4899"/><circle cx="33" cy="24" r="4" fill="#EC4899"/><circle cx="33" cy="32" r="4" fill="#EC4899"/><circle cx="33" cy="28" r="3" fill="#FBBF24"/>`
        : ''
    }
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const AVATAR_PALETTE = Array.from({ length: 12 }, (_, i) => makeCuteAvatarSvg(i));

// Cheerful pastel & candy colors for wheel segments
export const SLICE_COLORS = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Mint Turquoise
  '#FFD166', // Sunny Gold
  '#6C5CE7', // Royal Purple
  '#FF8E53', // Warm Sunset
  '#20BF6B', // Fresh Leaf Green
  '#FC5C65', // Raspberry Pink
  '#45AAF2', // Sky Blue
  '#A55EEA', // Lavender Orchid
  '#26DE81', // Emerald Mint
  '#FA8231', // Bright Orange
  '#2bcbba', // Teal Sea
];

export const INITIAL_STUDENTS: Student[] = [
  { id: 's1', name: 'Minh Khang', avatar: AVATAR_PALETTE[0], color: SLICE_COLORS[0], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's2', name: 'Bảo Châu', avatar: AVATAR_PALETTE[1], color: SLICE_COLORS[1], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's3', name: 'Tuấn Kiệt', avatar: AVATAR_PALETTE[2], color: SLICE_COLORS[2], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's4', name: 'Hà My', avatar: AVATAR_PALETTE[3], color: SLICE_COLORS[3], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's5', name: 'Gia Bảo', avatar: AVATAR_PALETTE[4], color: SLICE_COLORS[4], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's6', name: 'Mai Anh', avatar: AVATAR_PALETTE[5], color: SLICE_COLORS[5], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's7', name: 'Đức Phúc', avatar: AVATAR_PALETTE[6], color: SLICE_COLORS[6], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's8', name: 'Quỳnh Chi', avatar: AVATAR_PALETTE[7], color: SLICE_COLORS[7], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's9', name: 'Hoàng Nam', avatar: AVATAR_PALETTE[8 % AVATAR_PALETTE.length], color: SLICE_COLORS[8 % SLICE_COLORS.length], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's10', name: 'Khánh Linh', avatar: AVATAR_PALETTE[9 % AVATAR_PALETTE.length], color: SLICE_COLORS[9 % SLICE_COLORS.length], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's11', name: 'Hải Đăng', avatar: AVATAR_PALETTE[10 % AVATAR_PALETTE.length], color: SLICE_COLORS[10 % SLICE_COLORS.length], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's12', name: 'Thục Quyên', avatar: AVATAR_PALETTE[11 % AVATAR_PALETTE.length], color: SLICE_COLORS[11 % SLICE_COLORS.length], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's13', name: 'Quốc Anh', avatar: AVATAR_PALETTE[0], color: SLICE_COLORS[0], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's14', name: 'Phương Thảo', avatar: AVATAR_PALETTE[1], color: SLICE_COLORS[1], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's15', name: 'Trọng Nghĩa', avatar: AVATAR_PALETTE[2], color: SLICE_COLORS[2], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's16', name: 'Ngọc Diệp', avatar: AVATAR_PALETTE[3], color: SLICE_COLORS[3], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's17', name: 'Hữu Phước', avatar: AVATAR_PALETTE[4], color: SLICE_COLORS[4], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's18', name: 'Thanh Hằng', avatar: AVATAR_PALETTE[5], color: SLICE_COLORS[5], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's19', name: 'Tấn Phát', avatar: AVATAR_PALETTE[6], color: SLICE_COLORS[6], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's20', name: 'Cẩm Tú', avatar: AVATAR_PALETTE[7], color: SLICE_COLORS[7], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's21', name: 'Quang Huy', avatar: AVATAR_PALETTE[8 % AVATAR_PALETTE.length], color: SLICE_COLORS[8 % SLICE_COLORS.length], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's22', name: 'Yến Nhi', avatar: AVATAR_PALETTE[9 % AVATAR_PALETTE.length], color: SLICE_COLORS[9 % SLICE_COLORS.length], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
  { id: 's23', name: 'Đình Trọng', avatar: AVATAR_PALETTE[10 % AVATAR_PALETTE.length], color: SLICE_COLORS[10 % SLICE_COLORS.length], active: true, stars: 0, correctAnswers: 0, totalAnswerTimeSec: 0 },
];

export const INITIAL_QUESTIONS: Question[] = [
  // --- CHỦ ĐỀ 1: CẤU TẠO SỐ THẬP PHÂN (5 câu) ---
  {
    id: 'q1',
    category: 'Cấu tạo số thập phân',
    text: 'Mỗi số thập phân gồm có mấy phần và được ngăn cách bởi dấu gì?',
    options: [
      'Ba phần: phần nguyên, phần giữa và phần thập phân',
      'Hai phần: phần nguyên và phần thập phân, ngăn cách bởi dấu phẩy',
      'Hai phần: phần chẵn và phần lẻ, ngăn cách bởi dấu chấm',
      'Chỉ có một phần duy nhất là phần số thập phân',
    ],
    correctIndex: 1,
    hint: 'Gợi ý: Mỗi số thập phân gồm hai phần: phần nguyên (ở bên trái) và phần thập phân (ở bên phải), ngăn cách bởi dấu phẩy.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q2',
    category: 'Cấu tạo số thập phân',
    text: 'Trong số thập phân 84,357, chữ số 5 nằm ở hàng nào?',
    options: ['Hàng phần mười', 'Hàng phần trăm', 'Hàng phần nghìn', 'Hàng đơn vị'],
    correctIndex: 1,
    hint: 'Gợi ý: Chữ số 3 thuộc hàng phần mười, chữ số 5 thuộc hàng phần trăm, chữ số 7 thuộc hàng phần nghìn.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q3',
    category: 'Cấu tạo số thập phân',
    text: 'Số thập phân gồm "38 đơn vị, 5 phần mười và 6 phần nghìn" được viết là số nào?',
    options: ['38,56', '38,506', '38,056', '38,560'],
    correctIndex: 1,
    hint: 'Gợi ý: 38 đơn vị (phần nguyên), 5 phần mười, 0 phần trăm, 6 phần nghìn => Viết là 38,506.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q4',
    category: 'Cấu tạo số thập phân',
    text: 'Phân số thập phân 75/100 được viết dưới dạng số thập phân là số nào?',
    options: ['7,5', '0,75', '0,075', '75,0'],
    correctIndex: 1,
    hint: 'Gợi ý: 75/100 = 75 chia cho 100 = 0,75 (gồm 0 đơn vị và 75 phần trăm).',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q5',
    category: 'Cấu tạo số thập phân',
    text: 'Trong số thập phân 19,824, chữ số ở phần thập phân có giá trị lớn nhất là chữ số nào?',
    options: [
      'Chữ số 4 (có giá trị 4/1000)',
      'Chữ số 2 (có giá trị 2/100)',
      'Chữ số 8 (có giá trị 8/10)',
      'Chữ số 9 (có giá trị 9)',
    ],
    correctIndex: 2,
    hint: 'Gợi ý: Chữ số 8 ở hàng phần mười có giá trị là 0,8 (8/10), lớn hơn hàng phần trăm (0,02) và hàng phần nghìn (0,004).',
    timeLimitSec: 20,
    used: false,
  },

  // --- CHỦ ĐỀ 2: THÀNH PHẦN CỦA ĐẤT & VAI TRÒ ĐỐI VỚI CÂY TRỒNG (5 câu) ---
  {
    id: 'q6',
    category: 'Thành phần & vai trò của đất',
    text: 'Đất trồng tự nhiên bao gồm những thành phần chính nào?',
    options: [
      'Chỉ có hạt cát, sỏi vụn và các mảnh đá vỡ',
      'Chất khoáng, chất mùn, không khí, nước và các sinh vật trong đất',
      'Chỉ có nước và phân bón hóa học',
      'Chỉ có chất mùn và hạt sét mịn',
    ],
    correctIndex: 1,
    hint: 'Gợi ý: Đất gồm 4 thành phần cơ bản: chất khoáng, chất mùn hữu cơ, nước, không khí cùng các vi sinh vật sinh sống trong đất.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q7',
    category: 'Thành phần & vai trò của đất',
    text: 'Chất mùn trong đất có nguồn gốc từ đâu và có vai trò gì quan trọng nhất?',
    options: [
      'Do nước mưa hòa tan tạo ra, làm cho đất trơn trượt',
      'Do xác thực vật và động vật bị phân hủy tạo thành, làm đất tơi xốp và phì nhiêu',
      'Do đá vôi vỡ vụn sinh ra, làm đất rắn chắc',
      'Do cát sỏi từ sa mạc gió thổi đến tích tụ',
    ],
    correctIndex: 1,
    hint: 'Gợi ý: Mùn sinh ra từ xác lá cây, rễ cây và động vật phân hủy, cung cấp dưỡng chất dồi dào tạo nên độ phì nhiêu màu mỡ của đất.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q8',
    category: 'Thành phần & vai trò của đất',
    text: 'Đất có vai trò gì quan trọng nhất đối với đời sống của cây trồng?',
    options: [
      'Giữ cho rễ cây đứng vững và cung cấp nước, chất khoáng, không khí cho cây',
      'Chỉ có tác dụng che mát cho rễ cây khỏi bị cháy nắng',
      'Cung cấp ánh sáng Mặt Trời trực tiếp cho lá quang hợp',
      'Ngăn cản không cho rễ cây tiếp xúc với không khí',
    ],
    correctIndex: 0,
    hint: 'Gợi ý: Đất là giá thể giúp rễ cây bám chặt đứng vững, đồng thời là kho dự trữ nước, oxy và các chất khoáng thiết yếu nuôi sống cây.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q9',
    category: 'Thành phần & vai trò của đất',
    text: 'Không khí có trong các khe hở của đất có vai trò gì đối với cây trồng?',
    options: [
      'Làm cho đất bị khô cằn và nứt nẻ',
      'Giúp rễ cây hô hấp, lấy khí oxy để sinh trưởng và trao đổi chất',
      'Giúp cây hút khí cac-bô-níc vào bên trong rễ',
      'Không có vai trò nào đối với cây trồng',
    ],
    correctIndex: 1,
    hint: 'Gợi ý: Khe hở trong đất chứa khí oxy giúp rễ cây hô hấp bình thường. Nếu đất bị ngập úng thiếu không khí, rễ cây sẽ bị thối và chết.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q10',
    category: 'Thành phần & vai trò của đất',
    text: 'Biện pháp nào sau đây giúp cải tạo và bảo vệ độ phì nhiêu cho đất trồng?',
    options: [
      'Lạm dụng phân bón hóa học và thuốc trừ sâu liều cao liên tục',
      'Bón phân hữu cơ (phân chuồng, phân xanh) và cày xới làm cỏ hợp lí',
      'Chặt phá cây xanh để đất trống đồi trọc phơi dưới nắng mưa',
      'Đốt rơm rạ liên tục trên mặt ruộng làm cháy lớp mùn',
    ],
    correctIndex: 1,
    hint: 'Gợi ý: Bón phân hữu cơ, cày xới đất tơi xốp, luân canh và trồng cây che phủ giúp bảo vệ tầng mùn, làm đất tơi xốp và màu mỡ lâu dài.',
    timeLimitSec: 20,
    used: false,
  },

  // --- CHỦ ĐỀ 3: VỊ TRÍ ĐỊA LÍ VÀ THIÊN NHIÊN VIỆT NAM (5 câu) ---
  {
    id: 'q11',
    category: 'Địa lí & thiên nhiên Việt Nam',
    text: 'Nước Việt Nam nằm ở đâu trên bản đồ thế giới?',
    options: [
      'Nằm ở bán đảo Đông Dương, thuộc khu vực Đông Nam Á',
      'Nằm ở trung tâm khu vực Nam Á',
      'Nằm ở khu vực Tây Á bên bờ Địa Trung Hải',
      'Nằm hoàn toàn ở khu vực Bắc Á lạnh giá',
    ],
    correctIndex: 0,
    hint: 'Gợi ý: Việt Nam thuộc khu vực Đông Nam Á, nằm trên bán đảo Đông Dương, có dải đất hình chữ S tiếp giáp với Biển Đông rộng lớn.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q12',
    category: 'Địa lí & thiên nhiên Việt Nam',
    text: 'Trên đất liền, đường biên giới nước ta tiếp giáp với những quốc gia nào?',
    options: [
      'Trung Quốc, Lào, Cam-pu-chia',
      'Trung Quốc, Thái Lan, Mi-an-ma',
      'Lào, Cam-pu-chia, Ma-lai-xi-a',
      'Trung Quốc, Phi-líp-pin, In-đô-nê-xi-a',
    ],
    correctIndex: 0,
    hint: 'Gợi ý: Phía bắc giáp Trung Quốc; phía tây giáp Lào và Cam-pu-chia.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q13',
    category: 'Địa lí & thiên nhiên Việt Nam',
    text: 'Đặc điểm nổi bật của địa hình phần đất liền nước ta là gì?',
    options: [
      'Đồi núi chiếm 1/4 diện tích, đồng bằng chiếm 3/4 diện tích',
      '3/4 diện tích là đồi núi và 1/4 diện tích là đồng bằng',
      'Toàn bộ lãnh thổ đều là núi cao trên 3000m',
      'Toàn bộ diện tích đất liền là bình nguyên cát và sa mạc',
    ],
    correctIndex: 1,
    hint: 'Gợi ý: Khoảng 3/4 diện tích phần đất liền nước ta là đồi núi (chủ yếu là đồi núi thấp), đồng bằng chỉ chiếm 1/4 diện tích.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q14',
    category: 'Địa lí & thiên nhiên Việt Nam',
    text: 'Khí hậu nước ta có đặc điểm chung nổi bật nào?',
    options: [
      'Khí hậu ôn đới mát mẻ quanh năm có tuyết phủ trắng',
      'Khí hậu nhiệt đới gió mùa: nhiệt độ cao, nhiều mưa và có hai mùa gió rõ rệt',
      'Khí hậu khô hạn hoang mạc, quanh năm hầu như không có mưa',
      'Khí hậu hàn đới băng giá quanh năm',
    ],
    correctIndex: 1,
    hint: 'Gợi ý: Nước ta có khí hậu nhiệt đới gió mùa: nhiệt độ cao, độ ẩm lớn, mưa nhiều và chịu ảnh hưởng của các mùa gió (gió mùa Đông Bắc và Tây Nam).',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q15',
    category: 'Địa lí & thiên nhiên Việt Nam',
    text: 'Hai con sông lớn bồi đắp nên hai đồng bằng châu thổ rộng lớn nhất nước ta là:',
    options: [
      'Sông Hương và sông Thu Bồn',
      'Sông Hồng và sông Mê Kông (sông Cửu Long)',
      'Sông Mã và sông Cả',
      'Sông Đồng Nai và sông Sài Gòn',
    ],
    correctIndex: 1,
    hint: 'Gợi ý: Sông Hồng bồi đắp Đồng bằng Bắc Bộ; hệ thống sông Mê Kông (sông Cửu Long) bồi đắp Đồng bằng Nam Bộ màu mỡ.',
    timeLimitSec: 20,
    used: false,
  },

  // --- CHỦ ĐỀ 4: BIỂN VÀ ĐẢO VIỆT NAM (4 câu) ---
  {
    id: 'q16',
    category: 'Biển và đảo Việt Nam',
    text: 'Vùng biển nước ta là một phần của vùng biển nào và có đặc điểm gì?',
    options: [
      'Là một phần của Biển Đông, có diện tích rộng lớn và nước ấm quanh năm',
      'Là một phần của Biển Đen, nước thường đóng băng về mùa đông',
      'Là một phần của Ấn Độ Dương, không bao giờ có bão đổ bộ',
      'Là một phần của Địa Trung Hải nằm sâu trong lục địa',
    ],
    correctIndex: 0,
    hint: 'Gợi ý: Vùng biển Việt Nam là một bộ phận của Biển Đông, diện tích biển trên 1 triệu km², nguồn nhiệt ẩm dồi dào và nước ấm quanh năm.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q17',
    category: 'Biển và đảo Việt Nam',
    text: 'Hai quần đảo lớn, xa bờ thuộc chủ quyền thiêng liêng của Việt Nam ở Biển Đông là:',
    options: [
      'Quần đảo Hoàng Sa và quần đảo Trường Sa',
      'Quần đảo Cát Bà và Côn Đảo',
      'Quần đảo Nam Du và Cô Tô',
      'Quần đảo Phú Quý và Hòn Tre',
    ],
    correctIndex: 0,
    hint: 'Gợi ý: Quần đảo Hoàng Sa (thuộc TP. Đà Nẵng) và Quần đảo Trường Sa (thuộc tỉnh Khánh Hòa) là chủ quyền thiêng liêng đời đời của Tổ quốc Việt Nam.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q18',
    category: 'Biển và đảo Việt Nam',
    text: 'Hòn đảo có diện tích lớn nhất nước ta, được mệnh danh là "Đảo Ngọc" là đảo nào?',
    options: [
      'Đảo Bạch Long Vĩ',
      'Đảo Cát Bà',
      'Đảo Phú Quốc (tỉnh Kiên Giang)',
      'Đảo Lý Sơn (tỉnh Quảng Ngãi)',
    ],
    correctIndex: 2,
    hint: 'Gợi ý: Đảo Phú Quốc thuộc tỉnh Kiên Giang ở vùng biển Tây Nam là đảo có diện tích lớn nhất nước ta (xấp xỉ 589 km²).',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q19',
    category: 'Biển và đảo Việt Nam',
    text: 'Biển và hải đảo mang lại những nguồn tài nguyên quý giá nào cho đất nước ta?',
    options: [
      'Nguồn thủy hải sản phong phú, dầu khí, muối biển, tiềm năng du lịch và hàng hải',
      'Chỉ có bãi cát hoang sơ và các rặng đá ngầm',
      'Rừng rậm rạp che phủ toàn bộ mặt nước biển',
      'Nguồn than đá khổng lồ nổi trên mặt biển',
    ],
    correctIndex: 0,
    hint: 'Gợi ý: Biển Việt Nam giàu hải sản, khoáng sản dầu khí dưới thềm lục địa, sản xuất muối, giao thương hàng hải quốc tế và du lịch nghỉ dưỡng tuyệt đẹp.',
    timeLimitSec: 20,
    used: false,
  },

  // --- CHỦ ĐỀ 5: HỖN HỢP VÀ DUNG DỊCH (4 câu) ---
  {
    id: 'q20',
    category: 'Hỗn hợp và dung dịch',
    text: 'Thế nào được gọi là một "hỗn hợp" trong khoa học tự nhiên?',
    options: [
      'Hai hay nhiều chất trộn lẫn vào nhau nhưng mỗi chất vẫn giữ nguyên tính chất của nó',
      'Hai chất trộn lẫn và lập tức biến đổi hoàn toàn thành một chất mới khác biệt',
      'Một chất duy nhất ở trạng thái tinh khiết không bị lẫn gì',
      'Bắt buộc phải là chất lỏng đun sôi đến 100 độ C',
    ],
    correctIndex: 0,
    hint: 'Gợi ý: Hỗn hợp là hai hay nhiều chất trộn lẫn với nhau mà từng chất vẫn giữ nguyên bản chất vốn có của nó (ví dụ: gạo lẫn trấu, cát trộn sỏi).',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q21',
    category: 'Hỗn hợp và dung dịch',
    text: 'Thế nào là một "dung dịch"?',
    options: [
      'Hỗn hợp gồm các hạt rắn không tan trôi lơ lửng trong nước làm nước vẩn đục',
      'Hỗn hợp đồng nhất của chất lỏng với chất tan (chất tan bị hòa tan hoàn toàn vào chất lỏng)',
      'Nước cất tinh khiết tuyệt đối không hòa tan chất gì',
      'Hỗn hợp gồm dầu ăn nổi lềnh bềnh trên mặt nước',
    ],
    correctIndex: 1,
    hint: 'Gợi ý: Dung dịch là hỗn hợp đồng nhất của chất lỏng và chất tan (chất rắn, chất lỏng hoặc chất khí hòa tan hoàn toàn vào dung môi).',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q22',
    category: 'Hỗn hợp và dung dịch',
    text: 'Trường hợp nào sau đây tạo thành một "DUNG DỊCH"?',
    options: [
      'Rót dầu ăn vào cốc nước rồi khuấy đều (dầu nổi lên trên)',
      'Trộn hạt gạo lẫn với các hạt đỗ đen trong bát',
      'Cho một thìa đường vào cốc nước ấm rồi khuấy tan hoàn toàn thành nước trong suốt',
      'Khuấy một nắm cát mịn vào nước làm cốc nước bị đục',
    ],
    correctIndex: 2,
    hint: 'Gợi ý: Đường tan hoàn toàn vào nước tạo thành dung dịch nước đường đồng nhất, không phân chia thành các lớp hay cặn lắng.',
    timeLimitSec: 20,
    used: false,
  },
  {
    id: 'q23',
    category: 'Hỗn hợp và dung dịch',
    text: 'Để tách muối ăn ra khỏi dung dịch nước muối, người ta thường dùng phương pháp nào?',
    options: [
      'Dùng phễu và giấy lọc thông thường',
      'Để yên cốc nước cho muối tự lắng xuống đáy',
      'Cô cạn (đun nóng hoặc phơi nắng cho nước bốc hơi hết, thu được muối kết tinh)',
      'Dùng nam châm để hút muối ra ngoài',
    ],
    correctIndex: 2,
    hint: 'Gợi ý: Phương pháp cô cạn: Khi đun nóng hoặc phơi dưới ánh nắng mặt trời, nước sẽ bay hơi hết, còn lại các hạt muối kết tinh ở đáy.',
    timeLimitSec: 20,
    used: false,
  },
];
