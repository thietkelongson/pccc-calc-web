// Danh mục "Cơ sở chuyên ngành" — tổng hợp standalone từ C.1/D.1/E.1/F.1.
//
// Cấu trúc ref:
//   { stt: "X.Y" }                           — luôn hiển thị (không phụ thuộc tier)
//   { stt: "X.Y", field: "...", gte/lte/gt/lt: v }  — chỉ hiển thị khi input thỏa
// scaleFields: danh sách các trường input cần hỏi user để xác định tier.
window.BANG_A2_CN_DATA = {
  "metadata": {
    "source": "QCVN 10:2025/BCA",
    "description": "Cơ sở chuyên ngành — gộp standalone từ C.1/D.1/E.1/F.1",
    "effectiveDate": "2025-12-30"
  },
  "items": [
    {
      "stt": "CN-1", "tenHangMuc": "Nhà sản xuất", "shortName": "Nhà sản xuất",
      "isChuyenNganh": true,
      "chuyenNganhRefs": { "e1": [{"stt":"1"}] }
    },
    {
      "stt": "CN-2",
      "tenHangMuc": "Kho dầu mỏ và sản phẩm dầu mỏ; kho khí hóa lỏng; cảng xuất, nhập dầu mỏ và sản phẩm dầu mỏ",
      "shortName": "Kho dầu mỏ / khí hóa lỏng / cảng xuất nhập dầu",
      "isChuyenNganh": true,
      "scaleFields": ["dungTichM3"],
      "chuyenNganhRefs": {
        "c1": [{"stt":"7"}],
        "d1": [
          {"stt":"1.1", "field":"dungTichM3", "gt":500000},
          {"stt":"1.2", "field":"dungTichM3", "gte":100000, "lte":500000},
          {"stt":"1.3", "field":"dungTichM3", "lt":100000}
        ],
        "f1": [{"stt":"5", "field":"dungTichM3", "gte":100000}]
      }
    },
    {
      "stt": "CN-3", "tenHangMuc": "Nhà máy nhiệt điện", "shortName": "Nhà máy nhiệt điện",
      "isChuyenNganh": true,
      "scaleFields": ["congSuatMW"],
      "chuyenNganhRefs": {
        "c1": [{"stt":"6"}],
        "d1": [
          {"stt":"3.1.1", "field":"congSuatMW", "gte":600, "lt":1200},
          {"stt":"3.1.2", "field":"congSuatMW", "gte":1200},
          {"stt":"3.3",   "field":"congSuatMW", "lt":600}
        ],
        "f1": [{"stt":"7", "field":"congSuatMW", "gte":600}]
      }
    },
    {
      "stt": "CN-4", "tenHangMuc": "Nhà máy thủy điện", "shortName": "Nhà máy thủy điện",
      "isChuyenNganh": true,
      "scaleFields": ["congSuatMW"],
      "chuyenNganhRefs": {
        "d1": [
          {"stt":"3.2", "field":"congSuatMW", "gte":1000},
          {"stt":"3.3", "field":"congSuatMW", "lt":1000}
        ],
        "f1": [{"stt":"6", "field":"congSuatMW", "gte":1000}]
      }
    },
    {
      "stt": "CN-5",
      "tenHangMuc": "Nhà máy lọc dầu; nhà máy hóa dầu; nhà máy lọc, hóa dầu; nhà máy sản xuất nhiên liệu sinh học",
      "shortName": "Nhà máy lọc / hóa dầu",
      "isChuyenNganh": true,
      "chuyenNganhRefs": {
        "c1": [{"stt":"7"}], "d1": [{"stt":"3.5"}], "f1": [{"stt":"4"}]
      }
    },
    {
      "stt": "CN-6",
      "tenHangMuc": "Cơ sở chế biến khí đốt; nhà máy chế biến khí",
      "shortName": "Cơ sở chế biến khí đốt",
      "isChuyenNganh": true,
      "scaleFields": ["congSuatM3Khi"],
      "chuyenNganhRefs": {
        "c1": [{"stt":"7"}],
        "d1": [{"stt":"3.6", "field":"congSuatM3Khi", "gte":10}],
        "f1": [{"stt":"3",   "field":"congSuatM3Khi", "gte":10}]
      }
    },
    {
      "stt": "CN-7", "tenHangMuc": "Nhà máy dệt", "shortName": "Nhà máy dệt",
      "isChuyenNganh": true,
      "scaleFields": ["congSuatM2Year"],
      "chuyenNganhRefs": {
        "d1": [{"stt":"3.4", "field":"congSuatM2Year", "gte":25}],
        "f1": [{"stt":"8",   "field":"congSuatM2Year", "gte":25}]
      }
    },
    {
      "stt": "CN-8", "tenHangMuc": "Trạm biến áp có điện áp từ 220 kV trở lên",
      "shortName": "Trạm biến áp ≥220 kV",
      "isChuyenNganh": true,
      "chuyenNganhRefs": { "c1": [{"stt":"6"}] }
    },
    {
      "stt": "CN-9", "tenHangMuc": "Khu công nghiệp, cụm công nghiệp",
      "shortName": "Khu / cụm công nghiệp",
      "isChuyenNganh": true,
      "scaleFields": ["dienTichHa"],
      "chuyenNganhRefs": {
        "c1": [{"stt":"10"}],
        "d1": [
          {"stt":"4.1", "field":"dienTichHa", "gt":300},
          {"stt":"4.2", "field":"dienTichHa", "gte":75, "lte":300},
          {"stt":"4.3", "field":"dienTichHa", "lt":75}
        ],
        "f1": [{"stt":"9", "field":"dienTichHa", "gte":75}]
      }
    },
    {
      "stt": "CN-10",
      "tenHangMuc": "Bến cảng biển có xuất, nhập chất nổ, chất khí, lỏng, rắn dễ cháy thuộc danh mục hàng hóa nguy hiểm",
      "shortName": "Bến cảng biển — hàng nguy hiểm",
      "isChuyenNganh": true,
      "scaleFields": ["capCongTrinh"],
      "chuyenNganhRefs": {
        "d1": [
          {"stt":"2.2.1", "field":"capCongTrinh", "eq":"db"},
          {"stt":"2.2.2", "field":"capCongTrinh", "eq":"1"},
          {"stt":"2.2.3", "field":"capCongTrinh", "in":["2","3"]}
        ],
        "f1": [{"stt":"10"}]
      }
    },
    {
      "stt": "CN-11",
      "tenHangMuc": "Bến cảng chuyên dùng LNG (tiếp nhận tàu/thiết bị dung tích chứa từ 8 000 m³ trở lên)",
      "shortName": "Bến cảng LNG",
      "isChuyenNganh": true,
      "scaleFields": ["dungTichM3"],
      "chuyenNganhRefs": {
        "d1": [{"stt":"2.2.4", "field":"dungTichM3", "gte":8000}]
      }
    },
    {
      "stt": "CN-12",
      "tenHangMuc": "Cơ sở đóng mới, sửa chữa, bảo dưỡng phương tiện thủy nội địa, tàu biển",
      "shortName": "Cơ sở đóng / sửa chữa tàu thủy",
      "isChuyenNganh": true,
      "scaleFields": ["tongDTS"],
      "chuyenNganhRefs": {
        "c1": [{"stt":"5", "field":"tongDTS", "gte":1500}]
      }
    },
    {
      "stt": "CN-13", "tenHangMuc": "Cơ sở sản xuất vật liệu nổ, tiền chất thuốc nổ công nghiệp",
      "shortName": "Sản xuất vật liệu nổ",
      "isChuyenNganh": true,
      "chuyenNganhRefs": { "c1": [{"stt":"8.1"}] }
    },
    {
      "stt": "CN-14", "tenHangMuc": "Kho cố định chứa vật liệu nổ, tiền chất thuốc nổ công nghiệp",
      "shortName": "Kho vật liệu nổ",
      "isChuyenNganh": true,
      "chuyenNganhRefs": { "c1": [{"stt":"8.2"}] }
    },
    {
      "stt": "CN-15", "tenHangMuc": "Khu liên hợp gang thép; nhà máy sản xuất, lắp ráp ô tô",
      "shortName": "Gang thép / lắp ráp ô tô",
      "isChuyenNganh": true,
      "chuyenNganhRefs": { "c1": [{"stt":"9.1"}] }
    },
    {
      "stt": "CN-16", "tenHangMuc": "Công trình sản xuất săm, lốp ô tô (>1 triệu chiếc/năm)",
      "shortName": "Sản xuất săm, lốp ô tô",
      "isChuyenNganh": true,
      "chuyenNganhRefs": { "c1": [{"stt":"9.2"}] }
    },
    {
      "stt": "CN-17", "tenHangMuc": "Công trình sản xuất, kho trạm chiết nạp sản phẩm hóa dầu (>50 nghìn tấn SP/năm)",
      "shortName": "Sản xuất / chiết nạp hóa dầu",
      "isChuyenNganh": true,
      "chuyenNganhRefs": { "c1": [{"stt":"9.3"}] }
    },
    {
      "stt": "CN-18",
      "tenHangMuc": "Khu dân cư đô thị/nông thôn; khu đô thị; khu nhà ở; khu du lịch; khu nghiên cứu, đào tạo; khu thể dục, thể thao",
      "shortName": "Khu dân cư / đô thị / du lịch",
      "isChuyenNganh": true,
      "chuyenNganhRefs": { "c1": [{"stt":"10"}] }
    }
  ]
};
