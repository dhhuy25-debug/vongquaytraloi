// Standalone 100% self-contained single-file HTML generator for classroom usage offline

export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VÒNG XOAY MAY MẮN LỚP HỌC - Phiên Bản Độc Lập Trình Duyệt</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Nunito', sans-serif;
      background: radial-gradient(circle at center, #FFFDF2 0%, #FEF9E7 50%, #FDE8B3 100%);
      color: #1E293B;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow-x: hidden;
    }
    header {
      background: #FFFFFF;
      border-bottom: 4px solid #FCD34D;
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.15);
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      position: sticky;
      top: 0;
      z-index: 30;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #F59E0B, #EA580C);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #FFF;
      box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
    }
    .brand-title h1 {
      font-family: 'Baloo 2', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #78350F;
      line-height: 1.1;
    }
    .brand-title p {
      font-size: 12px;
      color: #64748B;
      font-weight: 700;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn {
      font-family: 'Baloo 2', sans-serif;
      font-weight: 800;
      font-size: 14px;
      padding: 7px 14px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      box-shadow: 0 2px 5px rgba(0,0,0,0.06);
    }
    .btn:active { transform: scale(0.96); }
    .btn-top3 {
      background: linear-gradient(90deg, #F59E0B, #EA580C, #E11D48);
      color: #FFF;
      animation: pulse 2s infinite;
    }
    .btn-students { background: #F59E0B; color: #FFF; }
    .btn-school { background: #FEF3C7; color: #78350F; border: 1px solid #FCD34D; }
    .btn-questions { background: #0D9488; color: #FFF; }
    .btn-icon { background: #F1F5F9; color: #334155; padding: 8px 12px; }

    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      position: relative;
    }
    .wheel-arena {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .pointer {
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 25;
      pointer-events: none;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25));
    }
    #wheelCanvas {
      display: block;
      cursor: pointer;
      border-radius: 50%;
      box-shadow: 0 15px 35px rgba(0,0,0,0.18);
    }
    .btn-spin-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: radial-gradient(circle, #FDE047 0%, #F59E0B 70%, #D97706 100%);
      border: 5px solid #FFFFFF;
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.7);
      font-family: 'Baloo 2', sans-serif;
      font-size: 20px;
      font-weight: 900;
      color: #78350F;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 20;
      transition: all 0.2s;
    }
    .btn-spin-center:hover { transform: translate(-50%, -50%) scale(1.08); }
    .btn-spin-center:active { transform: translate(-50%, -50%) scale(0.95); }

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(4px);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
    }
    .modal-overlay.open {
      opacity: 1;
      visibility: visible;
    }
    .modal-card {
      background: #FFFFFF;
      border-radius: 28px;
      width: 100%;
      max-width: 680px;
      max-height: 94vh;
      overflow-y: auto;
      border: 4px solid #FCD34D;
      box-shadow: 0 25px 60px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
    }
    .modal-header {
      background: linear-gradient(90deg, #F59E0B, #FB7185, #EC4899);
      padding: 14px 20px;
      color: #FFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-header h2 {
      font-family: 'Baloo 2', sans-serif;
      font-size: 22px;
      font-weight: 800;
    }
    .modal-close {
      background: rgba(255,255,255,0.25);
      border: none;
      color: #FFF;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      font-weight: 800;
    }
    .modal-body {
      padding: 20px;
    }

    /* Star Gauge */
    .star-gauge-box {
      background: linear-gradient(180deg, #FFFDF5, #FEF3C7);
      border: 3px solid #FCD34D;
      border-radius: 20px;
      padding: 14px;
      margin-bottom: 16px;
      text-align: center;
    }
    .star-slots {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 4px;
      margin: 10px 0;
    }
    .star-slot {
      background: #E2E8F0;
      border-radius: 10px;
      padding: 6px 2px;
      font-size: 11px;
      font-weight: 800;
      color: #94A3B8;
      border: 2px solid #CBD5E1;
      transition: all 0.2s;
    }
    .star-slot.active {
      background: linear-gradient(180deg, #FDE68A, #F59E0B);
      border-color: #D97706;
      color: #78350F;
      transform: scale(1.05);
      box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4);
    }
    .star-slot.active span { font-size: 16px; display: block; }
    .star-slot span { font-size: 14px; display: block; }

    /* Multiple choice options */
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 14px;
    }
    @media (max-width: 600px) {
      .options-grid { grid-template-columns: 1fr; }
    }
    .opt-btn {
      padding: 12px 14px;
      border-radius: 16px;
      border: 3px solid #E2E8F0;
      background: #FFF;
      font-family: 'Baloo 2', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: #1E293B;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.15s;
    }
    .opt-btn:hover { border-color: #F59E0B; background: #FFFBEB; }
    .opt-badge {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: #F59E0B;
      color: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 15px;
      flex-shrink: 0;
    }
    .opt-btn.correct {
      background: #10B981 !important;
      border-color: #059669 !important;
      color: #FFF !important;
    }
    .opt-btn.correct .opt-badge { background: #FFF; color: #059669; }
    .opt-btn.wrong {
      background: #FEE2E2 !important;
      border-color: #FCA5A5 !important;
      color: #991B1B !important;
      text-decoration: line-through;
      opacity: 0.6;
    }

    /* Certificate Modal */
    .cert-frame {
      background: linear-gradient(180deg, #FFFDF0 0%, #FFFBEA 50%, #FEF3C7 100%);
      border: 8px solid #F59E0B;
      border-radius: 24px;
      padding: 30px;
      text-align: center;
      position: relative;
      box-shadow: 0 10px 30px rgba(245, 158, 11, 0.2);
    }
    .cert-frame h1 {
      font-family: 'Baloo 2', sans-serif;
      font-size: 38px;
      font-weight: 900;
      color: #78350F;
      margin: 6px 0;
    }
    .cert-avatar {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 4px solid #F59E0B;
      margin: 12px auto;
      background: #FFF;
      box-shadow: 0 6px 16px rgba(0,0,0,0.15);
      object-fit: cover;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
    canvas#confettiCanvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 10000;
    }

    /* Game Tabs */
    .game-tabs {
      background: #FFFFFF;
      border-bottom: 2px solid #FCD34D;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }
    .tab-group {
      display: flex;
      gap: 6px;
      background: #FEF3C7;
      padding: 4px;
      border-radius: 14px;
      border: 1px solid #FDE68A;
    }
    .tab-btn {
      font-family: 'Baloo 2', sans-serif;
      font-weight: 800;
      font-size: 13px;
      padding: 6px 14px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      background: transparent;
      color: #78350F;
    }
    .tab-btn.active-wheel {
      background: #F59E0B;
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(245, 158, 11, 0.35);
    }
    .tab-btn.active-horse {
      background: #059669;
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(5, 150, 105, 0.35);
    }

    /* Horse Race Arena */
    .horse-arena {
      width: 100%;
      max-width: 920px;
      margin: 10px auto;
      background: #2E7D32;
      border: 4px solid #1B5E20;
      border-radius: 24px;
      padding: 16px;
      box-shadow: 0 10px 30px rgba(27, 94, 32, 0.3);
      position: relative;
    }
    .horse-track-header {
      display: flex;
      justify-content: space-between;
      padding: 0 20px 8px 90px;
      color: #D1FAE5;
      font-size: 11px;
      font-weight: 800;
      border-bottom: 1px dashed rgba(255,255,255,0.3);
      margin-bottom: 8px;
    }
    .horse-lanes {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 55vh;
      overflow-y: auto;
      padding-right: 4px;
    }
    .horse-lane {
      position: relative;
      height: 60px;
      border-radius: 14px;
      background: linear-gradient(90deg, rgba(160,82,45,0.7) 0%, rgba(139,69,19,0.75) 50%, rgba(160,82,45,0.7) 100%);
      border: 1px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      padding: 0 10px;
      overflow: hidden;
    }
    .horse-stall {
      position: absolute;
      left: 6px;
      z-index: 10;
      background: rgba(0,0,0,0.6);
      color: #FFF;
      padding: 3px 8px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
      max-width: 110px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .horse-finish-line {
      position: absolute;
      right: 20px;
      top: 0;
      bottom: 0;
      width: 16px;
      background: repeating-linear-gradient(45deg, #000 0, #000 6px, #FFF 6px, #FFF 12px);
      border-left: 2px solid #FCD34D;
      border-right: 2px solid #FCD34D;
    }
    .horse-runner {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 100px;
      transition: left 0.05s linear;
      z-index: 20;
      pointer-events: none;
    }
    .horse-avatar-badge {
      position: absolute;
      top: -4px;
      left: 14px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid #FFF;
      background: #FFF;
      object-fit: cover;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <canvas id="confettiCanvas"></canvas>

  <header>
    <div class="brand">
      <div class="brand-icon">🎡</div>
      <div class="brand-title">
        <h1>VÒNG XOAY MAY MẮN LỚP HỌC</h1>
        <p>Gọi học sinh · Trả lời nhanh cộng 10 sao · Trao Thư Khen</p>
      </div>
    </div>
    <div class="header-actions">
      <button class="btn btn-top3" onclick="openLeaderboard()">
        🏆 Xếp Hạng & Top 3
      </button>
      <button class="btn btn-students" onclick="openStudentModal()">
        🎒 Học sinh (<span id="activeCount">8</span>/<span id="totalCount">8</span>)
      </button>
      <button class="btn btn-school" onclick="openSchoolModal()">
        🏫 Trường & GV
      </button>
      <button class="btn btn-questions" onclick="openQuestionModal()">
        ❓ Câu hỏi (<span id="questionCount">6</span>)
      </button>
      <button class="btn btn-icon" onclick="toggleSound()">
        <span id="soundIcon">🔊</span>
      </button>
    </div>
  </header>

  <!-- Game Mode Tabs -->
  <div class="game-tabs">
    <div class="tab-group">
      <button id="tabWheelBtn" class="tab-btn active-wheel" onclick="switchGameTab('wheel')">
        🎡 VÒNG XOAY MAY MẮN
      </button>
      <button id="tabHorseBtn" class="tab-btn" onclick="switchGameTab('horserace')">
        🏇 ĐUA NGỰA KỲ THÚ
      </button>
    </div>
    <div style="font-size: 12px; font-weight: 700; color: #78350F;">
      ✨ Điểm sao & Thư Khen được đồng bộ cho cả 2 trò chơi
    </div>
  </div>

  <!-- Auto-Skip Status Banner -->
  <div id="skipBanner" style="display: flex; justify-content: center; align-items: center; gap: 10px; margin: 10px auto 4px auto; max-width: 720px; padding: 6px 16px; background: #FEF3C7; border: 1.5px solid #FCD34D; border-radius: 999px; font-size: 13px; font-weight: 800; color: #92400E; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
    <span id="skipBannerText">🎯 Vòng quay sẽ tự động bỏ qua học sinh đã được chọn cho các lượt tiếp theo</span>
    <button id="restoreAllBtn" class="btn" style="padding: 4px 12px; font-size: 12px; background: #D97706; color: #FFF; border-radius: 999px; display: none; font-weight: 900;" onclick="restoreAllStudents()">
      🔄 Khôi phục tất cả
    </button>
  </div>

  <main>
    <!-- TAB 1: WHEEL ARENA -->
    <div id="wheelArenaContainer" class="wheel-arena">
      <div class="pointer">
        <svg width="44" height="52" viewBox="0 0 44 52">
          <path d="M22 50 L6 14 C4 9 8 4 14 4 L30 4 C36 4 40 9 38 14 Z" fill="#EF4444" stroke="#FFFFFF" stroke-width="3"/>
          <circle cx="22" cy="16" r="6" fill="#FDE047"/>
        </svg>
      </div>
      <canvas id="wheelCanvas" width="520" height="520"></canvas>
      <button id="spinBtn" class="btn-spin-center" onclick="startSpin()">
        QUAY
      </button>
    </div>

    <!-- TAB 2: HORSE ARENA -->
    <div id="horseArenaContainer" class="horse-arena" style="display: none;">
      <div class="horse-track-header">
        <span>0m (Xuất phát)</span>
        <span>50m</span>
        <span>100m</span>
        <span>150m</span>
        <span style="color: #FCD34D;">Vạch Đích 🏁</span>
      </div>
      <div id="horseLanesList" class="horse-lanes">
        <!-- Rendered dynamically -->
      </div>
      <div style="display: flex; justify-content: center; margin-top: 14px; gap: 10px;">
        <button id="startRaceBtn" class="btn" style="background: linear-gradient(90deg, #059669, #0D9488); color: #FFF; font-size: 17px; padding: 12px 28px; border-radius: 16px; box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4);" onclick="startHorseRace()">
          🏇 XUẤT PHÁT ĐUA NGỰA
        </button>
        <button class="btn" style="background: rgba(255,255,255,0.85); color: #1E293B;" onclick="resetHorsePositions()">
          ↺ Về vạch xuất phát
        </button>
      </div>
    </div>
  </main>

  <!-- Winner & Quiz Modal -->
  <div id="quizModal" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h2 id="modalTitle">LƯỢT THI CỦA BẠN</h2>
        <button class="modal-close" onclick="closeQuizModal()">✕</button>
      </div>
      <div class="modal-body" id="modalBody">
        <!-- Rendered dynamically -->
      </div>
    </div>
  </div>

  <!-- Leaderboard Modal -->
  <div id="leaderboardModal" class="modal-overlay">
    <div class="modal-card" style="max-width: 720px;">
      <div class="modal-header" style="background: linear-gradient(90deg, #F59E0B, #EA580C);">
        <h2>🏆 BẢNG VINH DANH TOP 3 XUẤT SẮC</h2>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn" style="background: rgba(255,255,255,0.25); color: #FFF; font-size: 11px; padding: 4px 8px;" onclick="resetScoresToZero()">↺ Đặt lại 0 sao</button>
          <button class="modal-close" onclick="closeLeaderboard()">✕</button>
        </div>
      </div>
      <div class="modal-body" id="leaderboardBody">
        <!-- Podium & Top 3 -->
      </div>
    </div>
  </div>

  <!-- Certificate Modal -->
  <div id="certModal" class="modal-overlay">
    <div class="modal-card" style="max-width: 780px;">
      <div class="modal-header" style="background: #F59E0B;">
        <h2>🌟 THƯ KHEN THƯỞNG HỌC SINH</h2>
        <div>
          <button class="btn" style="background: #FFF; color: #78350F; margin-right: 6px;" onclick="window.print()">🖨️ In Thư Khen</button>
          <button class="modal-close" onclick="closeCertModal()">✕</button>
        </div>
      </div>
      <div class="modal-body">
        <div class="cert-frame" id="printableCert">
          <p style="font-weight: 800; color: #92400E; text-transform: uppercase;" id="certSchoolText">TRƯỜNG TIỂU HỌC KIM ĐỒNG</p>
          <h1>THƯ KHEN THƯỞNG</h1>
          <p style="font-weight: 800; color: #D97706; letter-spacing: 2px;">BÉ CHĂM NGOAN HỌC GIỎI · HOA ĐIỂM 10</p>
          <img id="certAvatar" class="cert-avatar" src="" alt="Avatar">
          <p style="font-size: 14px; color: #64748B; margin-top: 4px;">Thầy/Cô và tập thể lớp biểu dương em:</p>
          <h2 id="certStudentName" style="font-family: 'Baloo 2', sans-serif; font-size: 32px; color: #1E293B; font-weight: 900;">Tên Học Sinh</h2>
          <p id="certClassText" style="font-weight: 800; color: #B45309;">Lớp 3A</p>
          <p style="font-family: 'Baloo 2', sans-serif; font-size: 18px; color: #78350F; margin: 12px 0;">"Đã có thành tích xuất sắc và trả lời chính xác, thần tốc trong giờ học ôn tập!"</p>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; padding-top: 14px; border-top: 2px dashed #FCD34D;">
            <div style="text-align: left;">
              <p style="font-weight: 800; color: #475569;">Tập thể lớp khen ngợi</p>
              <p style="font-size: 20px; margin-top: 4px;">👏 🎈 💐</p>
            </div>
            <div style="text-align: right;">
              <p style="font-weight: 800; color: #475569;">Giáo viên chủ nhiệm</p>
              <p id="certTeacherText" style="font-family: 'Baloo 2', sans-serif; font-size: 20px; font-weight: 900; color: #78350F; margin-top: 8px;">Cô Nguyễn Thu Trang</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- School Settings Modal -->
  <div id="schoolModal" class="modal-overlay">
    <div class="modal-card" style="max-width: 480px;">
      <div class="modal-header">
        <h2>🏫 CÀI ĐẶT TRƯỜNG & GIÁO VIÊN</h2>
        <button class="modal-close" onclick="closeSchoolModal()">✕</button>
      </div>
      <div class="modal-body">
        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; font-weight: 800; display: block; margin-bottom: 4px;">TÊN TRƯỜNG:</label>
          <input id="inputSchool" type="text" style="width: 100%; padding: 10px; border-radius: 10px; border: 2px solid #FCD34D; font-weight: 700;">
        </div>
        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; font-weight: 800; display: block; margin-bottom: 4px;">LỚP HỌC:</label>
          <input id="inputClass" type="text" style="width: 100%; padding: 10px; border-radius: 10px; border: 2px solid #FCD34D; font-weight: 700;">
        </div>
        <div style="margin-bottom: 16px;">
          <label style="font-size: 12px; font-weight: 800; display: block; margin-bottom: 4px;">TÊN GIÁO VIÊN:</label>
          <input id="inputTeacher" type="text" style="width: 100%; padding: 10px; border-radius: 10px; border: 2px solid #FCD34D; font-weight: 700;">
        </div>
        <button class="btn btn-students" style="width: 100%; justify-content: center; padding: 12px; font-size: 16px;" onclick="saveSchoolSettings()">
          Lưu Thông Tin
        </button>
      </div>
    </div>
  </div>

  <!-- Student Manager Modal -->
  <div id="studentModal" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header" style="background: #F59E0B;">
        <h2>🎒 QUẢN LÝ DANH SÁCH HỌC SINH</h2>
        <button class="modal-close" onclick="closeStudentModal()">✕</button>
      </div>
      <div class="modal-body">
        <div style="display: flex; gap: 8px; margin-bottom: 14px;">
          <input id="newStudentName" type="text" placeholder="Nhập tên học sinh mới..." style="flex: 1; padding: 10px; border-radius: 10px; border: 2px solid #FCD34D; font-weight: 700;">
          <button class="btn btn-students" onclick="addNewStudent()">+ Thêm</button>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #E2E8F0;">
          <span style="font-size: 13px; font-weight: 800; color: #475569;">Danh sách lớp</span>
          <button class="btn" style="background: #FEE2E2; color: #B91C1C; font-size: 11px; padding: 4px 8px;" onclick="resetScoresToZero()">↺ Đặt lại sao về 0</button>
        </div>
        <div id="studentsList" style="max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px;"></div>
      </div>
    </div>
  </div>

  <script>
    // Audio synthesizer
    let audioEnabled = true;
    let audioCtx = null;
    function getAudioContext() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }
    function toggleSound() {
      audioEnabled = !audioEnabled;
      document.getElementById('soundIcon').textContent = audioEnabled ? '🔊' : '🔇';
    }
    function playTick() {
      if (!audioEnabled) return;
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch(e) {}
    }
    function playFanfare() {
      if (!audioEnabled) return;
      try {
        const ctx = getAudioContext();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
        });
      } catch(e) {}
    }

    function playRaceHorn() {
      if (!audioEnabled) return;
      try {
        const ctx = getAudioContext();
        [392, 523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);
          gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.14 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.14);
          osc.stop(ctx.currentTime + idx * 0.14 + 0.38);
        });
      } catch(e) {}
    }

    function playGallop() {
      if (!audioEnabled) return;
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch(e) {}
    }

    // Cute SVG Avatar Generator
    function makeAvatar(idx) {
      const colors = ['#0284C7', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#FB7185', '#4F46E5', '#14B8A6'];
      const bgs = ['#E0F2FE', '#FCE7F3', '#DCFCE7', '#FEF3C7', '#EDE9FE', '#FFE4E6', '#E0E7FF', '#CCFBF1'];
      const c = colors[idx % colors.length];
      const bg = bgs[idx % bgs.length];
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
        '<circle cx="50" cy="50" r="48" fill="' + bg + '"/>' +
        '<circle cx="50" cy="45" r="22" fill="#FCD34D"/>' +
        '<circle cx="42" cy="42" r="3" fill="#1E293B"/>' +
        '<circle cx="58" cy="42" r="3" fill="#1E293B"/>' +
        '<path d="M44 52 Q50 58 56 52" stroke="#B45309" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M25 90 C25 70, 75 70, 75 90 Z" fill="' + c + '"/>' +
        '</svg>';
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    // Initial Data
    let schoolInfo = {
      school: localStorage.getItem('classroom_cert_school') || 'Trường Tiểu học Kim Đồng',
      cls: localStorage.getItem('classroom_cert_class') || 'Lớp 3A',
      teacher: localStorage.getItem('classroom_cert_teacher') || 'Cô Nguyễn Thu Trang'
    };

    let students = [
      { id: '1', name: 'Minh Khang', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(0), color: '#FF6B6B' },
      { id: '2', name: 'Bảo Châu', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(1), color: '#4ECDC4' },
      { id: '3', name: 'Tuấn Kiệt', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(2), color: '#FFD166' },
      { id: '4', name: 'Hà My', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(3), color: '#6C5CE7' },
      { id: '5', name: 'Gia Bảo', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(4), color: '#FF8E53' },
      { id: '6', name: 'Mai Anh', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(5), color: '#20BF6B' },
      { id: '7', name: 'Đức Phúc', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(6), color: '#FC5C65' },
      { id: '8', name: 'Quỳnh Chi', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(7), color: '#45AAF2' },
      { id: '9', name: 'Hoàng Nam', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(8), color: '#A55EEA' },
      { id: '10', name: 'Khánh Linh', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(9), color: '#26DE81' },
      { id: '11', name: 'Hải Đăng', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(10), color: '#FA8231' },
      { id: '12', name: 'Thục Quyên', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(11), color: '#2bcbba' },
      { id: '13', name: 'Quốc Anh', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(0), color: '#FF6B6B' },
      { id: '14', name: 'Phương Thảo', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(1), color: '#4ECDC4' },
      { id: '15', name: 'Trọng Nghĩa', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(2), color: '#FFD166' },
      { id: '16', name: 'Ngọc Diệp', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(3), color: '#6C5CE7' },
      { id: '17', name: 'Hữu Phước', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(4), color: '#FF8E53' },
      { id: '18', name: 'Thanh Hằng', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(5), color: '#20BF6B' },
      { id: '19', name: 'Tấn Phát', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(6), color: '#FC5C65' },
      { id: '20', name: 'Cẩm Tú', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(7), color: '#45AAF2' },
      { id: '21', name: 'Quang Huy', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(8), color: '#A55EEA' },
      { id: '22', name: 'Yến Nhi', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(9), color: '#26DE81' },
      { id: '23', name: 'Đình Trọng', stars: 0, correctAnswers: 0, totalTime: 0, active: true, avatar: makeAvatar(10), color: '#FA8231' }
    ];

    let questions = [
      // 1. Cấu tạo số thập phân (5 câu)
      {
        text: 'Mỗi số thập phân gồm có mấy phần và được ngăn cách bởi dấu gì?',
        category: 'Cấu tạo số thập phân',
        options: ['Ba phần: phần nguyên, phần giữa và phần thập phân', 'Hai phần: phần nguyên và phần thập phân, ngăn cách bởi dấu phẩy', 'Hai phần: phần chẵn và phần lẻ, ngăn cách bởi dấu chấm', 'Chỉ có một phần duy nhất là phần số thập phân'],
        correctIndex: 1
      },
      {
        text: 'Trong số thập phân 84,357, chữ số 5 nằm ở hàng nào?',
        category: 'Cấu tạo số thập phân',
        options: ['Hàng phần mười', 'Hàng phần trăm', 'Hàng phần nghìn', 'Hàng đơn vị'],
        correctIndex: 1
      },
      {
        text: 'Số thập phân gồm "38 đơn vị, 5 phần mười và 6 phần nghìn" được viết là số nào?',
        category: 'Cấu tạo số thập phân',
        options: ['38,56', '38,506', '38,056', '38,560'],
        correctIndex: 1
      },
      {
        text: 'Phân số thập phân 75/100 được viết dưới dạng số thập phân là số nào?',
        category: 'Cấu tạo số thập phân',
        options: ['7,5', '0,75', '0,075', '75,0'],
        correctIndex: 1
      },
      {
        text: 'Trong số thập phân 19,824, chữ số ở phần thập phân có giá trị lớn nhất là chữ số nào?',
        category: 'Cấu tạo số thập phân',
        options: ['Chữ số 4 (có giá trị 4/1000)', 'Chữ số 2 (có giá trị 2/100)', 'Chữ số 8 (có giá trị 8/10)', 'Chữ số 9 (có giá trị 9)'],
        correctIndex: 2
      },
      // 2. Thành phần và vai trò của đất (5 câu)
      {
        text: 'Đất trồng tự nhiên bao gồm những thành phần chính nào?',
        category: 'Thành phần & vai trò của đất',
        options: ['Chỉ có hạt cát, sỏi vụn và các mảnh đá vỡ', 'Chất khoáng, chất mùn, không khí, nước và các sinh vật trong đất', 'Chỉ có nước và phân bón hóa học', 'Chỉ có chất mùn và hạt sét mịn'],
        correctIndex: 1
      },
      {
        text: 'Chất mùn trong đất có nguồn gốc từ đâu và có vai trò gì quan trọng nhất?',
        category: 'Thành phần & vai trò của đất',
        options: ['Do nước mưa hòa tan tạo ra, làm đất trơn trượt', 'Do xác thực vật và động vật bị phân hủy tạo thành, làm đất tơi xốp và phì nhiêu', 'Do đá vôi vỡ vụn sinh ra, làm đất rắn chắc', 'Do cát sỏi từ sa mạc gió thổi đến tích tụ'],
        correctIndex: 1
      },
      {
        text: 'Đất có vai trò gì quan trọng nhất đối với đời sống của cây trồng?',
        category: 'Thành phần & vai trò của đất',
        options: ['Giữ cho rễ cây đứng vững và cung cấp nước, chất khoáng, không khí cho cây', 'Chỉ có tác dụng che mát cho rễ cây khỏi bị cháy nắng', 'Cung cấp ánh sáng Mặt Trời trực tiếp cho lá quang hợp', 'Ngăn cản không cho rễ cây tiếp xúc với không khí'],
        correctIndex: 0
      },
      {
        text: 'Không khí có trong các khe hở của đất có vai trò gì đối với cây trồng?',
        category: 'Thành phần & vai trò của đất',
        options: ['Làm cho đất bị khô cằn và nứt nẻ', 'Giúp rễ cây hô hấp, lấy khí oxy để sinh trưởng và trao đổi chất', 'Giúp cây hút khí cac-bô-níc vào bên trong rễ', 'Không có vai trò nào đối với cây trồng'],
        correctIndex: 1
      },
      {
        text: 'Biện pháp nào sau đây giúp cải tạo và bảo vệ độ phì nhiêu cho đất trồng?',
        category: 'Thành phần & vai trò của đất',
        options: ['Lạm dụng phân bón hóa học và thuốc trừ sâu liều cao liên tục', 'Bón phân hữu cơ (phân chuồng, phân xanh) và cày xới làm cỏ hợp lí', 'Chặt phá cây xanh để đất trống đồi trọc phơi dưới nắng mưa', 'Đốt rơm rạ liên tục trên mặt ruộng làm cháy lớp mùn'],
        correctIndex: 1
      },
      // 3. Vị trí địa lí và thiên nhiên Việt Nam (5 câu)
      {
        text: 'Nước Việt Nam nằm ở đâu trên bản đồ thế giới?',
        category: 'Địa lí & thiên nhiên Việt Nam',
        options: ['Nằm ở bán đảo Đông Dương, thuộc khu vực Đông Nam Á', 'Nằm ở trung tâm khu vực Nam Á', 'Nằm ở khu vực Tây Á bên bờ Địa Trung Hải', 'Nằm hoàn toàn ở khu vực Bắc Á lạnh giá'],
        correctIndex: 0
      },
      {
        text: 'Trên đất liền, đường biên giới nước ta tiếp giáp với những quốc gia nào?',
        category: 'Địa lí & thiên nhiên Việt Nam',
        options: ['Trung Quốc, Lào, Cam-pu-chia', 'Trung Quốc, Thái Lan, Mi-an-ma', 'Lào, Cam-pu-chia, Ma-lai-xi-a', 'Trung Quốc, Phi-líp-pin, In-đô-nê-xi-a'],
        correctIndex: 0
      },
      {
        text: 'Đặc điểm nổi bật của địa hình phần đất liền nước ta là gì?',
        category: 'Địa lí & thiên nhiên Việt Nam',
        options: ['Đồi núi chiếm 1/4 diện tích, đồng bằng chiếm 3/4 diện tích', '3/4 diện tích là đồi núi và 1/4 diện tích là đồng bằng', 'Toàn bộ lãnh thổ đều là núi cao trên 3000m', 'Toàn bộ diện tích đất liền là bình nguyên cát và sa mạc'],
        correctIndex: 1
      },
      {
        text: 'Khí hậu nước ta có đặc điểm chung nổi bật nào?',
        category: 'Địa lí & thiên nhiên Việt Nam',
        options: ['Khí hậu ôn đới mát mẻ quanh năm có tuyết phủ trắng', 'Khí hậu nhiệt đới gió mùa: nhiệt độ cao, nhiều mưa và có hai mùa gió rõ rệt', 'Khí hậu khô hạn hoang mạc, quanh năm hầu như không có mưa', 'Khí hậu hàn đới băng giá quanh năm'],
        correctIndex: 1
      },
      {
        text: 'Hai con sông lớn bồi đắp nên hai đồng bằng châu thổ rộng lớn nhất nước ta là:',
        category: 'Địa lí & thiên nhiên Việt Nam',
        options: ['Sông Hương và sông Thu Bồn', 'Sông Hồng và sông Mê Kông (sông Cửu Long)', 'Sông Mã và sông Cả', 'Sông Đồng Nai và sông Sài Gòn'],
        correctIndex: 1
      },
      // 4. Biển và đảo Việt Nam (4 câu)
      {
        text: 'Vùng biển nước ta là một phần của vùng biển nào và có đặc điểm gì?',
        category: 'Biển và đảo Việt Nam',
        options: ['Là một phần của Biển Đông, có diện tích rộng lớn và nước ấm quanh năm', 'Là một phần của Biển Đen, nước thường đóng băng về mùa đông', 'Là một phần của Ấn Độ Dương, không bao giờ có bão đổ bộ', 'Là một phần của Địa Trung Hải nằm sâu trong lục địa'],
        correctIndex: 0
      },
      {
        text: 'Hai quần đảo lớn, xa bờ thuộc chủ quyền thiêng liêng của Việt Nam ở Biển Đông là:',
        category: 'Biển và đảo Việt Nam',
        options: ['Quần đảo Hoàng Sa và quần đảo Trường Sa', 'Quần đảo Cát Bà và Côn Đảo', 'Quần đảo Nam Du và Cô Tô', 'Quần đảo Phú Quý và Hòn Tre'],
        correctIndex: 0
      },
      {
        text: 'Hòn đảo có diện tích lớn nhất nước ta, được mệnh danh là "Đảo Ngọc" là đảo nào?',
        category: 'Biển và đảo Việt Nam',
        options: ['Đảo Bạch Long Vĩ', 'Đảo Cát Bà', 'Đảo Phú Quốc (tỉnh Kiên Giang)', 'Đảo Lý Sơn (tỉnh Quảng Ngãi)'],
        correctIndex: 2
      },
      {
        text: 'Biển và hải đảo mang lại những nguồn tài nguyên quý giá nào cho đất nước ta?',
        category: 'Biển và đảo Việt Nam',
        options: ['Nguồn thủy hải sản phong phú, dầu khí, muối biển, tiềm năng du lịch và hàng hải', 'Chỉ có bãi cát hoang sơ và các rặng đá ngầm', 'Rừng rậm rạp che phủ toàn bộ mặt nước biển', 'Nguồn than đá khổng lồ nổi trên mặt biển'],
        correctIndex: 0
      },
      // 5. Hỗn hợp và dung dịch (4 câu)
      {
        text: 'Thế nào được gọi là một "hỗn hợp" trong khoa học tự nhiên?',
        category: 'Hỗn hợp và dung dịch',
        options: ['Hai hay nhiều chất trộn lẫn vào nhau nhưng mỗi chất vẫn giữ nguyên tính chất của nó', 'Hai chất trộn lẫn và lập tức biến đổi hoàn toàn thành một chất mới khác biệt', 'Một chất duy nhất ở trạng thái tinh khiết không bị lẫn gì', 'Bắt buộc phải là chất lỏng đun sôi đến 100 độ C'],
        correctIndex: 0
      },
      {
        text: 'Thế nào là một "dung dịch"?',
        category: 'Hỗn hợp và dung dịch',
        options: ['Hỗn hợp gồm các hạt rắn không tan trôi lơ lửng trong nước làm nước vẩn đục', 'Hỗn hợp đồng nhất của chất lỏng với chất tan (chất tan bị hòa tan hoàn toàn vào chất lỏng)', 'Nước cất tinh khiết tuyệt đối không hòa tan chất gì', 'Hỗn hợp gồm dầu ăn nổi lềnh bềnh trên mặt nước'],
        correctIndex: 1
      },
      {
        text: 'Trường hợp nào sau đây tạo thành một "DUNG DỊCH"?',
        category: 'Hỗn hợp và dung dịch',
        options: ['Rót dầu ăn vào cốc nước rồi khuấy đều (dầu nổi lên trên)', 'Trộn hạt gạo lẫn với các hạt đỗ đen trong bát', 'Cho một thìa đường vào cốc nước ấm rồi khuấy tan hoàn toàn thành nước trong suốt', 'Khuấy một nắm cát mịn vào nước làm cốc nước bị đục'],
        correctIndex: 2
      },
      {
        text: 'Để tách muối ăn ra khỏi dung dịch nước muối, người ta thường dùng phương pháp nào?',
        category: 'Hỗn hợp và dung dịch',
        options: ['Dùng phễu và giấy lọc thông thường', 'Để yên cốc nước cho muối tự lắng xuống đáy', 'Cô cạn (đun nóng hoặc phơi nắng cho nước bốc hơi hết, thu được muối kết tinh)', 'Dùng nam châm để hút muối ra ngoài'],
        correctIndex: 2
      }
    ];

    // Mark all questions as unused initially
    questions.forEach(q => { q.used = false; });

    // Pick a question without repeating until all are used
    function pickNextQuestion(excludeCurrent) {
      let unused = questions.filter(q => !q.used && (!excludeCurrent || q !== currentQuestion));
      if (unused.length === 0) {
        questions.forEach(q => { q.used = false; });
        unused = questions.filter(q => !excludeCurrent || q !== currentQuestion);
        if (unused.length === 0) unused = questions;
      }
      const q = unused[Math.floor(Math.random() * unused.length)];
      if (q) q.used = true;
      updateCounters();
      return q;
    }

    function restoreAllQuestions() {
      questions.forEach(q => { q.used = false; });
      updateCounters();
      playPop();
    }

    // Canvas Wheel Setup
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    let currentAngle = 0;
    let isSpinning = false;
    let currentWinner = null;
    let currentQuestion = null;

    // Cache avatar images
    const imageCache = {};
    students.forEach(s => {
      const img = new Image();
      img.src = s.avatar;
      imageCache[s.id] = img;
    });

    function getActiveStudents() {
      return students.filter(s => s.active);
    }

    function updateCounters() {
      const active = getActiveStudents();
      const unusedQ = questions.filter(q => !q.used).length;
      document.getElementById('activeCount').textContent = active.length;
      document.getElementById('totalCount').textContent = students.length;
      document.getElementById('questionCount').textContent = unusedQ + '/' + questions.length;

      const restoreBtn = document.getElementById('restoreAllBtn');
      const bannerText = document.getElementById('skipBannerText');
      if (restoreBtn && bannerText) {
        if (active.length < students.length) {
          restoreBtn.style.display = 'inline-flex';
          bannerText.textContent = '🎯 Đã gọi & bỏ qua ' + (students.length - active.length) + ' em (Còn lại ' + active.length + '/' + students.length + ' học sinh · Còn ' + unusedQ + '/' + questions.length + ' câu hỏi)';
        } else {
          restoreBtn.style.display = 'none';
          bannerText.textContent = '🎯 Vòng quay sẽ tự động bỏ qua học sinh đã được chọn & không lặp lại câu hỏi đã hỏi';
        }
      }
    }

    function restoreAllStudents() {
      students.forEach(s => s.active = true);
      renderStudentsList();
      drawWheel();
      renderHorseLanes();
      updateCounters();
      playPop();
    }

    function drawWheel() {
      const active = getActiveStudents();
      const numSlices = active.length;
      const size = 520;
      const center = size / 2;
      const radius = size / 2 - 24;

      ctx.clearRect(0, 0, size, size);

      if (numSlices === 0) {
        ctx.fillStyle = '#FEF3C7';
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#92400E';
        ctx.font = 'bold 22px "Baloo 2", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 ĐÃ GỌI HẾT TẤT CẢ HỌC SINH!', center, center - 14);
        ctx.font = 'bold 15px "Nunito", sans-serif';
        ctx.fillStyle = '#B45309';
        ctx.fillText('Bấm "Khôi phục tất cả" để bắt đầu vòng mới', center, center + 16);
        return;
      }

      // Outer rim
      ctx.beginPath();
      ctx.arc(center, center, radius + 12, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();

      // Slices
      const sliceAngle = (Math.PI * 2) / numSlices;
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(currentAngle);

      for (let i = 0; i < numSlices; i++) {
        const student = active[i];
        const startA = i * sliceAngle;
        const endA = startA + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startA, endA);
        ctx.closePath();
        ctx.fillStyle = student.color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Text & Avatar
        ctx.save();
        ctx.rotate(startA + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px "Baloo 2", sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 4;
        ctx.fillText(student.name, radius - 64, 6);

        // Draw avatar image
        const img = imageCache[student.id];
        if (img && img.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(radius - 32, 0, 22, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(img, radius - 54, -22, 44, 44);
          ctx.restore();
        }

        ctx.restore();
      }
      ctx.restore();
    }

    // Wheel Spin Engine
    function startSpin() {
      const active = getActiveStudents();
      if (active.length === 0 || isSpinning) return;

      isSpinning = true;
      document.getElementById('spinBtn').disabled = true;

      const winnerIdx = Math.floor(Math.random() * active.length);
      const sliceAngle = (Math.PI * 2) / active.length;
      const targetSliceCenter = winnerIdx * sliceAngle + sliceAngle / 2;
      const pointerAngle = -Math.PI / 2;
      const desiredAngle = (pointerAngle - targetSliceCenter) % (Math.PI * 2);
      const fullRotations = 6 + Math.floor(Math.random() * 2);
      const totalDelta = fullRotations * Math.PI * 2 + ((desiredAngle - (currentAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2));

      const startA = currentAngle;
      const startTime = performance.now();
      const duration = 5000;
      let lastTickAngle = currentAngle;

      function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Ease-out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentAngle = startA + totalDelta * easeOut;

        // Tick sounds
        if (Math.abs(currentAngle - lastTickAngle) >= sliceAngle) {
          playTick();
          lastTickAngle = currentAngle;
        }

        drawWheel();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isSpinning = false;
          document.getElementById('spinBtn').disabled = false;
          currentWinner = active[winnerIdx];
          currentQuestion = pickNextQuestion();
          playFanfare();
          fireConfetti();
          openQuizPhase1();
        }
      }

      requestAnimationFrame(animate);
    }

    // QUIZ PHASES (Requirement 8: Phase 1 -> Student clicks "Hiển thị câu hỏi" -> Phase 2 starts 10-star countdown)
    let quizInterval = null;
    let quizTimeLeft = 20;
    let quizCurrentStars = 10;
    let quizAnswered = false;

    function openQuizPhase1() {
      const modal = document.getElementById('quizModal');
      const body = document.getElementById('modalBody');
      document.getElementById('modalTitle').textContent = 'CHÚC MỪNG: ' + currentWinner.name.toUpperCase();

      body.innerHTML = \`
        <div style="text-align: center; padding: 10px 0;">
          <img src="\${currentWinner.avatar}" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid #F59E0B; margin-bottom: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.15);">
          <h2 style="font-family: 'Baloo 2', sans-serif; font-size: 32px; font-weight: 900; color: #1E293B;">\${currentWinner.name}</h2>
          <p style="font-size: 16px; font-weight: 700; color: #78350F; max-width: 480px; margin: 8px auto 20px;">
            Mời em đứng dậy, sẵn sàng tinh thần và bấm nút bên dưới để mở câu hỏi trắc nghiệm và bắt đầu tính sao!
          </p>
          <div style="background: #FEF3C7; border: 2px solid #FCD34D; border-radius: 16px; padding: 10px 20px; display: inline-block; margin-bottom: 24px; font-weight: 800; color: #B45309;">
            ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ Tối đa 10 Sao Vàng
          </div>
          <div>
            <button class="btn btn-spin" style="font-size: 20px; padding: 14px 36px; border-radius: 18px; width: 100%; max-width: 460px; margin: 0 auto; display: flex; justify-content: center;" onclick="startQuizPhase2()">
              🚀 BẤM ĐỂ HIỂN THỊ CÂU HỎI & TÍNH SAO! ⭐
            </button>
          </div>
        </div>
      \`;

      modal.classList.add('open');
    }

    function startQuizPhase2() {
      quizTimeLeft = 20;
      quizCurrentStars = 10;
      quizAnswered = false;
      renderQuizPhase2();

      if (quizInterval) clearInterval(quizInterval);
      quizInterval = setInterval(() => {
        if (quizAnswered) {
          clearInterval(quizInterval);
          return;
        }
        quizTimeLeft -= 0.2;
        const fraction = Math.max(0, quizTimeLeft / 20);
        const newStars = Math.max(1, Math.ceil(fraction * 10));
        if (newStars !== quizCurrentStars) {
          quizCurrentStars = newStars;
          playTick();
          updateStarGauge();
        }
        if (quizTimeLeft <= 0) {
          clearInterval(quizInterval);
        }
      }, 200);
    }

    function changeQuestionInQuiz() {
      if (quizAnswered) return;
      currentQuestion = pickNextQuestion(true);
      playPop();
      renderQuizPhase2();
    }

    function renderQuizPhase2() {
      const body = document.getElementById('modalBody');
      const q = currentQuestion;

      let slotsHtml = '';
      for (let i = 1; i <= 10; i++) {
        const active = i <= quizCurrentStars ? 'active' : '';
        slotsHtml += \`<div class="star-slot \${active}" id="slot_\${i}"><span>★</span>\${i}</div>\`;
      }

      let optionsHtml = '';
      const letters = ['A', 'B', 'C', 'D'];
      q.options.forEach((opt, idx) => {
        optionsHtml += \`
          <button class="opt-btn" id="optBtn_\${idx}" onclick="handleSelectOption(\${idx})">
            <span class="opt-badge">\${letters[idx]}</span>
            <span>\${opt}</span>
          </button>
        \`;
      });

      body.innerHTML = \`
        <div>
          <!-- 10-Star Decreasing Gauge -->
          <div class="star-gauge-box">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; font-weight: 900; color: #78350F;">THANH SỐ SAO GIẢM DẦN THEO THỜI GIAN:</span>
              <span id="starCounterText" style="background: #F59E0B; color: #FFF; padding: 2px 12px; border-radius: 20px; font-weight: 900; font-family: 'Baloo 2'; font-size: 16px;">
                \${quizCurrentStars} / 10 SAO
              </span>
            </div>
            <div class="star-slots" id="starSlotsContainer">
              \${slotsHtml}
            </div>
            <p style="font-size: 11px; color: #92400E; font-weight: 700;">* Trả lời càng nhanh thì số sao tích lũy càng nhiều!</p>
          </div>

          <!-- Question Text -->
          <div style="background: #FFF; border: 3px solid #FCD34D; border-radius: 20px; padding: 18px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #FEF3C7; color: #78350F; font-weight: 800; font-size: 12px; padding: 4px 10px; border-radius: 8px;">\${q.category}</span>
                <span style="background: #CCFBF1; color: #115E59; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 6px;">🎯 Không lặp lại (Còn \${questions.filter(qu => !qu.used).length}/\${questions.length} câu)</span>
              </div>
              <button class="btn" style="background: #F1F5F9; color: #334155; font-size: 11px; padding: 4px 8px; border: 1px solid #CBD5E1;" onclick="changeQuestionInQuiz()">↺ Đổi câu khác</button>
            </div>
            <h3 style="font-family: 'Baloo 2', sans-serif; font-size: 22px; font-weight: 800; color: #0F172A; margin-top: 6px;">\${q.text}</h3>
          </div>

          <!-- 4 Interactive Options -->
          <div class="options-grid">
            \${optionsHtml}
          </div>

          <!-- Feedback & Result -->
          <div id="quizFeedback" style="margin-top: 14px; text-align: center;"></div>
        </div>
      \`;
    }

    function updateStarGauge() {
      const text = document.getElementById('starCounterText');
      if (text) text.textContent = quizCurrentStars + ' / 10 SAO';
      for (let i = 1; i <= 10; i++) {
        const slot = document.getElementById('slot_' + i);
        if (slot) {
          if (i <= quizCurrentStars) slot.classList.add('active');
          else slot.classList.remove('active');
        }
      }
    }

    function handleSelectOption(idx) {
      if (quizAnswered) return;
      const q = currentQuestion;

      if (idx === q.correctIndex) {
        quizAnswered = true;
        clearInterval(quizInterval);
        playFanfare();
        fireConfetti();

        // Award stars to student
        currentWinner.stars += quizCurrentStars;
        currentWinner.correctAnswers += 1;
        currentWinner.totalTime += Math.round(20 - quizTimeLeft);

        const btn = document.getElementById('optBtn_' + idx);
        if (btn) btn.classList.add('correct');

        const feedback = document.getElementById('quizFeedback');
        feedback.innerHTML = \`
          <div style="background: #DCFCE7; border: 2px solid #86EFAC; color: #166534; padding: 14px; border-radius: 16px; font-weight: 900; font-size: 18px; font-family: 'Baloo 2';">
            🎉 XUẤT SẮC! BẠN ĐÃ GIÀNH ĐƯỢC +\${quizCurrentStars} SAO VÀNG! ⭐
          </div>
          <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 8px;">
            <button class="btn" style="background: linear-gradient(135deg, #10B981, #059669); color: #FFF; padding: 14px; justify-content: center; font-size: 16px; font-weight: 900; border-radius: 14px;" onclick="handleNextTurnAutoSkip()">
              🎯 TIẾP TỤC LƯỢT TIẾP THEO (Tự động bỏ qua \${currentWinner ? currentWinner.name : 'em này'})
            </button>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #64748B;">
              <span style="color: #059669; font-weight: 700;">✓ Vòng quay sẽ bỏ qua bạn này ở lượt tiếp theo</span>
              <button class="btn" style="background: transparent; color: #64748B; padding: 2px 6px; font-size: 12px; text-decoration: underline;" onclick="handleKeepWinner()">
                Vẫn giữ lại trong vòng quay
              </button>
            </div>
          </div>
        \`;
      } else {
        playTick();
        const btn = document.getElementById('optBtn_' + idx);
        if (btn) btn.classList.add('wrong');
        const feedback = document.getElementById('quizFeedback');
        feedback.innerHTML = \`
          <div style="color: #DC2626; font-weight: 800; font-size: 14px;">
            Chưa chính xác rồi! Em hãy nhanh tay chọn đáp án khác nhé!
          </div>
        \`;
      }
    }

    function handleNextTurnAutoSkip() {
      if (currentWinner) {
        currentWinner.active = false;
        currentWinner = null;
      }
      closeQuizModalDirect();
      drawWheel();
      renderHorseLanes();
      updateCounters();
    }

    function handleRemoveWinner() {
      if (currentWinner) {
        currentWinner.active = false;
        currentWinner = null;
      }
      closeQuizModalDirect();
      drawWheel();
      renderHorseLanes();
      updateCounters();
    }

    function handleKeepWinner() {
      currentWinner = null;
      closeQuizModalDirect();
      drawWheel();
      renderHorseLanes();
      updateCounters();
    }

    function closeQuizModalDirect() {
      if (quizInterval) clearInterval(quizInterval);
      document.getElementById('quizModal').classList.remove('open');
    }

    function closeQuizModal() {
      if (currentWinner) {
        currentWinner.active = false;
        currentWinner = null;
      }
      closeQuizModalDirect();
      drawWheel();
      renderHorseLanes();
      updateCounters();
    }

    // LEADERBOARD & CERTIFICATE
    function openLeaderboard() {
      const modal = document.getElementById('leaderboardModal');
      const body = document.getElementById('leaderboardBody');

      const sorted = [...students].sort((a, b) => {
        const starsA = typeof a.stars === 'number' && !isNaN(a.stars) ? a.stars : 0;
        const starsB = typeof b.stars === 'number' && !isNaN(b.stars) ? b.stars : 0;
        if (starsB !== starsA) return starsB - starsA;

        const correctA = typeof a.correctAnswers === 'number' && !isNaN(a.correctAnswers) ? a.correctAnswers : 0;
        const correctB = typeof b.correctAnswers === 'number' && !isNaN(b.correctAnswers) ? b.correctAnswers : 0;
        if (correctB !== correctA) return correctB - correctA;

        const timeA = typeof a.totalTime === 'number' && !isNaN(a.totalTime) ? a.totalTime : 0;
        const timeB = typeof b.totalTime === 'number' && !isNaN(b.totalTime) ? b.totalTime : 0;
        return timeA - timeB;
      });

      const top1 = sorted[0];
      const top2 = sorted[1];
      const top3 = sorted[2];

      const listRowsHtml = sorted.map((st, idx) => {
        const rankColor = idx === 0 ? '#F59E0B' : idx === 1 ? '#94A3B8' : idx === 2 ? '#D97706' : '#64748B';
        const bg = idx === 0 ? '#FEF3C7' : idx === 1 ? '#F1F5F9' : idx === 2 ? '#FFFBEB' : '#FFFFFF';
        return \`
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: \\\${bg}; border: 1.5px solid \\\${idx <= 2 ? '#FCD34D' : '#E2E8F0'}; border-radius: 12px; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="width: 26px; height: 26px; border-radius: 50%; background: \\\${rankColor}; color: #FFF; font-weight: 900; font-size: 12px; display: inline-flex; align-items: center; justify-content: center;">\\\${idx + 1}</span>
              <img src="\\\${st.avatar}" style="width: 38px; height: 38px; border-radius: 50%; border: 2px solid #CBD5E1; object-fit: cover;">
              <div>
                <div style="font-weight: 800; font-size: 13.5px; color: #1E293B;">\\\${st.name}</div>
                <div style="font-size: 11px; color: #64748B;">Đúng \\\${st.correctAnswers || 0} câu · \\\${st.stars || 0} sao</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 900; color: #D97706; font-size: 12.5px;">⭐ \\\${st.stars || 0} sao</span>
              <button class="btn" style="background: #FEF3C7; color: #92400E; font-size: 11px; padding: 4px 8px; border: 1px solid #FCD34D;" onclick="openCert('\\\\\${st.id}', \\\${idx + 1})">📜 Thư Khen</button>
            </div>
          </div>
        \`;
      }).join('');

      body.innerHTML = \`
        <div style="display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 10px; align-items: flex-end; margin-bottom: 24px; text-align: center;">
          <!-- Top 2 -->
          \\\${top2 ? \`
            <div style="background: #F1F5F9; border-radius: 18px 18px 0 0; padding: 14px 8px; border: 2px solid #CBD5E1;">
              <span style="font-size: 24px;">🥈</span>
              <img src="\\\\\${top2.avatar}" style="width: 60px; height: 60px; border-radius: 50%; border: 3px solid #94A3B8; margin: 6px auto;">
              <h4 style="font-family: 'Baloo 2'; font-size: 16px; font-weight: 800;">\\\\\${top2.name}</h4>
              <p style="font-weight: 800; color: #D97706; font-size: 13px;">\\\\\${top2.stars || 0} Sao</p>
              <button class="btn" style="background: #FFF; color: #475569; font-size: 11px; margin-top: 6px; padding: 4px 8px;" onclick="openCert('\\\\\${top2.id}', 2)">Thư Khen</button>
            </div>
          \` : '<div></div>'}

          <!-- Top 1 -->
          \\\${top1 ? \`
            <div style="background: linear-gradient(180deg, #FEF3C7, #FDE68A); border-radius: 22px 22px 0 0; padding: 20px 8px; border: 3px solid #F59E0B; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);">
              <span style="font-size: 32px;">👑 🥇</span>
              <img src="\\\\\${top1.avatar}" style="width: 76px; height: 76px; border-radius: 50%; border: 4px solid #F59E0B; margin: 8px auto;">
              <h3 style="font-family: 'Baloo 2'; font-size: 19px; font-weight: 900; color: #78350F;">\\\\\${top1.name}</h3>
              <p style="font-weight: 900; color: #B45309; font-size: 15px;">\\\\\${top1.stars || 0} Sao Vàng</p>
              <button class="btn btn-students" style="font-size: 12px; margin-top: 8px; padding: 6px 12px;" onclick="openCert('\\\\\${top1.id}', 1)">🌟 TẶNG THƯ KHEN</button>
            </div>
          \` : '<div></div>'}

          <!-- Top 3 -->
          \\\${top3 ? \`
            <div style="background: #FEF3C7; border-radius: 18px 18px 0 0; padding: 12px 8px; border: 2px solid #FCD34D;">
              <span style="font-size: 24px;">🥉</span>
              <img src="\\\\\${top3.avatar}" style="width: 60px; height: 60px; border-radius: 50%; border: 3px solid #D97706; margin: 6px auto;">
              <h4 style="font-family: 'Baloo 2'; font-size: 16px; font-weight: 800;">\\\\\${top3.name}</h4>
              <p style="font-weight: 800; color: #D97706; font-size: 13px;">\\\\\${top3.stars || 0} Sao</p>
              <button class="btn" style="background: #FFF; color: #475569; font-size: 11px; margin-top: 6px; padding: 4px 8px;" onclick="openCert('\\\\\${top3.id}', 3)">Thư Khen</button>
            </div>
          \` : '<div></div>'}
        </div>

        <div style="border-top: 2px dashed #E2E8F0; padding-top: 14px;">
          <h4 style="font-family: 'Baloo 2'; font-size: 15px; font-weight: 800; color: #334155; margin-bottom: 8px;">
            Bảng điểm chi tiết cả lớp (\\\${sorted.length} học sinh)
          </h4>
          <div style="max-height: 240px; overflow-y: auto; padding-right: 4px;">
            \\\${listRowsHtml}
          </div>
        </div>
      \`;

      modal.classList.add('open');
      playFanfare();
    }

    function closeLeaderboard() {
      document.getElementById('leaderboardModal').classList.remove('open');
    }

    function resetScoresToZero() {
      if (typeof window !== 'undefined' && window.confirm) {
        if (!window.confirm('Thầy/cô có muốn đặt lại toàn bộ sao và bảng xếp hạng về con số 0 để thi đua lại từ đầu?')) return;
      }
      students.forEach(s => {
        s.stars = 0;
        s.correctAnswers = 0;
        s.totalTime = 0;
      });
      playTick();
      if (document.getElementById('leaderboardModal').classList.contains('open')) {
        openLeaderboard();
      }
      if (document.getElementById('studentModal').classList.contains('open')) {
        renderStudentsList();
      }
    }

    function openCert(studentId, rank) {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      document.getElementById('certSchoolText').textContent = schoolInfo.school.toUpperCase();
      document.getElementById('certClassText').textContent = 'Học sinh ' + schoolInfo.cls + ' · ' + schoolInfo.school;
      document.getElementById('certTeacherText').textContent = schoolInfo.teacher;
      document.getElementById('certStudentName').textContent = 'Em: ' + student.name;
      document.getElementById('certAvatar').src = student.avatar;

      document.getElementById('certModal').classList.add('open');
    }

    function closeCertModal() {
      document.getElementById('certModal').classList.remove('open');
    }

    // SCHOOL SETTINGS MODAL
    function openSchoolModal() {
      document.getElementById('inputSchool').value = schoolInfo.school;
      document.getElementById('inputClass').value = schoolInfo.cls;
      document.getElementById('inputTeacher').value = schoolInfo.teacher;
      document.getElementById('schoolModal').classList.add('open');
    }

    function closeSchoolModal() {
      document.getElementById('schoolModal').classList.remove('open');
    }

    function saveSchoolSettings() {
      schoolInfo.school = document.getElementById('inputSchool').value.trim() || 'Trường Tiểu học Kim Đồng';
      schoolInfo.cls = document.getElementById('inputClass').value.trim() || 'Lớp 3A';
      schoolInfo.teacher = document.getElementById('inputTeacher').value.trim() || 'Cô Nguyễn Thu Trang';

      try {
        localStorage.setItem('classroom_cert_school', schoolInfo.school);
        localStorage.setItem('classroom_cert_class', schoolInfo.cls);
        localStorage.setItem('classroom_cert_teacher', schoolInfo.teacher);
      } catch(e) {}

      closeSchoolModal();
      playTick();
    }

    // STUDENT MANAGER
    function openStudentModal() {
      renderStudentsList();
      document.getElementById('studentModal').classList.add('open');
    }

    function closeStudentModal() {
      document.getElementById('studentModal').classList.remove('open');
    }

    function renderStudentsList() {
      const list = document.getElementById('studentsList');
      list.innerHTML = '';
      students.forEach((s, idx) => {
        const item = document.createElement('div');
        item.style = 'display: flex; align-items: center; justify-content: space-between; background: #F8FAFC; padding: 8px 12px; border-radius: 12px; border: 1px solid #E2E8F0;';
        item.innerHTML = \`
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="\${s.avatar}" style="width: 32px; height: 32px; border-radius: 50%;">
            <span style="font-weight: 800; font-size: 15px;">\${s.name}</span>
            <span style="font-size: 12px; color: #D97706; font-weight: 800;">⭐ \${s.stars}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn" style="padding: 4px 8px; font-size: 12px; background: \${s.active ? '#10B981' : '#CBD5E1'}; color: #FFF;" onclick="toggleStudentActive('\${s.id}')">
              \${s.active ? 'Đang chơi' : 'Tạm loại'}
            </button>
            <button class="btn" style="padding: 4px 8px; font-size: 12px; background: #EF4444; color: #FFF;" onclick="deleteStudent('\${s.id}')">✕</button>
          </div>
        \`;
        list.appendChild(item);
      });
    }

    function toggleStudentActive(id) {
      const s = students.find(x => x.id === id);
      if (s) {
        s.active = !s.active;
        renderStudentsList();
        drawWheel();
        updateCounters();
      }
    }

    function deleteStudent(id) {
      students = students.filter(x => x.id !== id);
      renderStudentsList();
      drawWheel();
      updateCounters();
    }

    function addNewStudent() {
      const input = document.getElementById('newStudentName');
      const name = input.value.trim();
      if (!name) return;

      const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6C5CE7', '#FF8E53', '#20BF6B', '#FC5C65', '#45AAF2'];
      const newS = {
        id: 's_' + Date.now(),
        name: name,
        stars: 0,
        correctAnswers: 0,
        totalTime: 0,
        active: true,
        avatar: makeAvatar(students.length),
        color: colors[students.length % colors.length]
      };

      students.push(newS);
      const img = new Image();
      img.src = newS.avatar;
      imageCache[newS.id] = img;

      input.value = '';
      renderStudentsList();
      drawWheel();
      updateCounters();
    }

    // QUESTIONS MODAL
    function openQuestionModal() {
      alert('Có sẵn ' + questions.length + ' câu hỏi trắc nghiệm 4 đáp án trong ngân hàng. Thầy/cô có thể thêm câu hỏi trực tiếp trên phiên bản React hoặc chỉnh sửa danh sách.');
    }

    // Confetti System
    function fireConfetti() {
      const cvs = document.getElementById('confettiCanvas');
      const c = cvs.getContext('2d');
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;

      const particles = [];
      const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6C5CE7', '#FF8E53', '#20BF6B'];

      for (let i = 0; i < 100; i++) {
        particles.push({
          x: cvs.width / 2,
          y: cvs.height * 0.6,
          vx: (Math.random() - 0.5) * 16,
          vy: -Math.random() * 16 - 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          life: 1
        });
      }

      function updateConfetti() {
        c.clearRect(0, 0, cvs.width, cvs.height);
        let alive = false;
        particles.forEach(p => {
          if (p.life > 0) {
            alive = true;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.4;
            p.life -= 0.015;
            c.fillStyle = p.color;
            c.globalAlpha = Math.max(0, p.life);
            c.fillRect(p.x, p.y, p.size, p.size);
          }
        });
        if (alive) requestAnimationFrame(updateConfetti);
        else c.clearRect(0, 0, cvs.width, cvs.height);
      }
      requestAnimationFrame(updateConfetti);
    }

    // GAME TAB SWITCHER & HORSE RACING ENGINE
    let currentTab = 'wheel';
    function switchGameTab(tab) {
      currentTab = tab;
      const wheelBtn = document.getElementById('tabWheelBtn');
      const horseBtn = document.getElementById('tabHorseBtn');
      const wheelSection = document.getElementById('wheelArenaContainer');
      const horseSection = document.getElementById('horseArenaContainer');

      if (tab === 'wheel') {
        wheelBtn.className = 'tab-btn active-wheel';
        horseBtn.className = 'tab-btn';
        wheelSection.style.display = 'block';
        horseSection.style.display = 'none';
        drawWheel();
      } else {
        wheelBtn.className = 'tab-btn';
        horseBtn.className = 'tab-btn active-horse';
        wheelSection.style.display = 'none';
        horseSection.style.display = 'block';
        renderHorseTrack();
      }
    }

    function renderHorseTrack() {
      const active = getActiveStudents();
      const list = document.getElementById('horseLanesList');
      if (!list) return;
      if (active.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: #FFF; padding: 20px; font-weight: bold;">Chưa có học sinh nào trên đường đua! Vui lòng kích hoạt trong bảng Học sinh.</div>';
        return;
      }
      list.innerHTML = active.map((student, idx) => {
        return '<div class="horse-lane" id="lane_' + student.id + '">' +
          '<div class="horse-stall">' +
            '<span style="background: ' + student.color + '; color: #FFF; border-radius: 4px; padding: 1px 5px; font-weight: 900;">' + (idx + 1) + '</span>' +
            '<span style="max-width: 80px; overflow: hidden; text-overflow: ellipsis;">' + student.name + '</span>' +
          '</div>' +
          '<div class="horse-finish-line"></div>' +
          '<div class="horse-runner" id="runner_' + student.id + '" style="left: 100px;">' +
            '<svg width="56" height="40" viewBox="0 0 100 70" fill="none">' +
              '<ellipse cx="48" cy="36" rx="26" ry="14" fill="#8B4513" />' +
              '<path d="M40 25 C44 23 54 23 58 25 L60 38 C55 41 43 41 38 38 Z" fill="' + student.color + '" stroke="#FFF" stroke-width="1.5" />' +
              '<path d="M62 38 L76 22 L86 24 C89 27 88 32 82 35 L68 45 Z" fill="#8B4513" />' +
              '<circle cx="82" cy="26" r="2" fill="#000" />' +
              '<path d="M64 42 L72 56 L82 65 L76 66 L67 58 L58 45 Z" fill="#5D4037" />' +
              '<path d="M32 40 L22 56 L16 66 L22 67 L28 58 L38 43 Z" fill="#5D4037" />' +
              '<path d="M20 32 C12 36 6 48 8 56 C11 50 16 42 22 36 Z" fill="#3E2723" />' +
            '</svg>' +
            '<img src="' + student.avatar + '" class="horse-avatar-badge" alt="' + student.name + '">' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function resetHorsePositions() {
      const active = getActiveStudents();
      active.forEach(s => {
        const el = document.getElementById('runner_' + s.id);
        if (el) el.style.left = '100px';
      });
    }

    let isRacing = false;
    function startHorseRace() {
      const active = getActiveStudents();
      if (active.length === 0 || isRacing) return;
      isRacing = true;
      const startBtn = document.getElementById('startRaceBtn');
      if (startBtn) startBtn.disabled = true;

      playRaceHorn();

      const predeterminedWinner = active[Math.floor(Math.random() * active.length)];
      const startTime = performance.now();
      const duration = 6000;
      const arena = document.getElementById('horseArenaContainer');
      const trackWidth = (arena ? arena.clientWidth : 800) - 200;

      let gallopTimer = setInterval(() => {
        playGallop();
      }, 280);

      function step(now) {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);

        active.forEach(s => {
          const isW = s.id === predeterminedWinner.id;
          const wobble = Math.sin((elapsed / 250) + (parseInt(s.id.slice(-2), 16) || 1)) * 12;
          let horseProg;
          if (p < 0.72) {
            horseProg = p * 0.72 + (Math.random() - 0.5) * 0.08;
          } else {
            const sprintP = (p - 0.72) / 0.28;
            horseProg = 0.52 + (isW ? 0.48 : 0.32 + Math.random() * 0.08) * sprintP;
          }
          const clamped = Math.max(0, Math.min(1, horseProg));
          const el = document.getElementById('runner_' + s.id);
          if (el) {
            el.style.left = (100 + clamped * trackWidth + wobble) + 'px';
          }
        });

        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          clearInterval(gallopTimer);
          isRacing = false;
          if (startBtn) startBtn.disabled = false;
          const winnerEl = document.getElementById('runner_' + predeterminedWinner.id);
          if (winnerEl) winnerEl.style.left = (100 + trackWidth) + 'px';

          currentWinner = predeterminedWinner;
          currentQuestion = pickNextQuestion();
          playFanfare();
          fireConfetti();
          openQuizPhase1();
        }
      }

      requestAnimationFrame(step);
    }

    // Spacebar listener for Wheel and Horse Race
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (currentTab === 'wheel' && !isSpinning) {
          startSpin();
        } else if (currentTab === 'horserace' && !isRacing) {
          startHorseRace();
        }
      }
    });

    // Initialize
    window.addEventListener('load', () => {
      drawWheel();
      updateCounters();
      renderHorseTrack();
    });
  </script>
</body>
</html>`;
}
