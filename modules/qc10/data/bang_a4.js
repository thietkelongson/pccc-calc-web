window.BANG_A4_DATA = {
  "metadata": {
    "source": "QCVN 10:2025/BCA",
    "table": "Bảng A.4 - Đối với thiết bị",
    "effectiveDate": "2025-12-30",
    "description": "Phụ lục A - Trang bị báo cháy/chữa cháy tự động cho buồng sơn, tháp thu hồi chất thải, máy biến áp dầu, trạm thử nghiệm",
    "notes": [
      "Áp dụng cho từng THIẾT BỊ cụ thể trong nhà — bổ trợ Bảng A.1/A.2/A.3 theo 1.5.9",
      "Mục 3 phân theo cấp điện áp và công suất MVA"
    ]
  },
  "footnotes": {
    "1": "Cho phép sử dụng thiết bị chữa cháy tự động thay thế hệ thống chữa cháy tự động.",
    "CHU_THICH": "Dấu '-' trong các bảng tại Phụ lục A được hiểu là không bắt buộc phải trang bị hệ thống báo cháy tự động/chữa cháy tự động."
  },
  "items": [
    {
      "stt": "1",
      "tenThietBi": "Buồng sơn sử dụng chất lỏng dễ cháy hoặc chất lỏng cháy",
      "shortName": "Buồng sơn (chất lỏng cháy/dễ cháy)",
      "footnotes": [
        "1"
      ],
      "baoChayCriteria": {
        "type": "khongPhuThuocDienTich",
        "description": "Không phụ thuộc vào quy mô"
      },
      "chuaChayCriteria": {
        "type": "khong",
        "description": "-"
      }
    },
    {
      "stt": "2",
      "tenThietBi": "Tháp thu hồi chất thải (ví dụ: bụi, than, mùn) dễ cháy",
      "shortName": "Tháp thu hồi chất thải dễ cháy",
      "footnotes": [
        "1"
      ],
      "baoChayCriteria": {
        "type": "khongPhuThuocDienTich",
        "description": "Không phụ thuộc vào quy mô"
      },
      "chuaChayCriteria": {
        "type": "khong",
        "description": "-"
      }
    },
    {
      "stt": "3",
      "tenThietBi": "Máy biến áp làm mát bằng dầu — phân theo cấp điện áp và vị trí lắp đặt",
      "shortName": "Máy biến áp dầu",
      "subTypes": [
        {
          "subStt": "3.1",
          "description": "Điện áp 110 kV đặt trong gian phòng của trạm biến áp",
          "baoChayCriteria": {
            "type": "khongPhuThuocDienTich",
            "description": "Không phụ thuộc công suất"
          },
          "chuaChayCriteria": {
            "type": "congSuatTroLen",
            "value": 63,
            "unit": "MVA",
            "description": "Công suất từ 63 MVA trở lên"
          }
        },
        {
          "subStt": "3.2",
          "description": "Điện áp 110 kV lắp đặt trong các nhà máy điện",
          "baoChayCriteria": {
            "type": "congSuatTroLen",
            "value": 63,
            "unit": "MVA",
            "description": "Công suất từ 63 MVA trở lên"
          },
          "chuaChayCriteria": {
            "type": "congSuatTroLen",
            "value": 63,
            "unit": "MVA",
            "description": "Công suất từ 63 MVA trở lên"
          }
        },
        {
          "subStt": "3.3",
          "description": "Điện áp 220 kV",
          "baoChayCriteria": {
            "type": "khongPhuThuocDienTich",
            "description": "Không phụ thuộc công suất"
          },
          "chuaChayCriteria": {
            "type": "congSuatTroLen",
            "value": 200,
            "unit": "MVA",
            "description": "Công suất từ 200 MVA trở lên"
          }
        },
        {
          "subStt": "3.4",
          "description": "Điện áp 500 kV trở lên",
          "baoChayCriteria": {
            "type": "khongPhuThuocDienTich",
            "description": "Không phụ thuộc công suất"
          },
          "chuaChayCriteria": {
            "type": "khongPhuThuocDienTich",
            "description": "Không phụ thuộc công suất"
          }
        }
      ]
    },
    {
      "stt": "4",
      "tenThietBi": "Máy biến áp của trạm biến áp không người trực",
      "shortName": "MBA trạm BA không người trực",
      "baoChayCriteria": {
        "type": "khongPhuThuocDienTich",
        "description": "Không phụ thuộc công suất"
      },
      "chuaChayCriteria": {
        "type": "congSuatTroLen",
        "value": 125,
        "unit": "MVA",
        "description": "Công suất từ 125 MVA trở lên"
      }
    },
    {
      "stt": "5",
      "tenThietBi": "Máy biến áp đặt trong gian phòng của nhà có công năng khác (không bao gồm mục 3 của Bảng này)",
      "shortName": "MBA trong nhà công năng khác",
      "baoChayCriteria": {
        "type": "khongPhuThuocDienTich",
        "description": "Không phụ thuộc công suất"
      },
      "chuaChayCriteria": {
        "type": "multi",
        "conditions": [
          {
            "type": "congSuatTroLen",
            "value": 63,
            "unit": "MVA",
            "description": "Công suất từ 63 MVA trở lên"
          },
          {
            "type": "dienApTroLen",
            "value": 110,
            "unit": "kV",
            "description": "Điện áp từ 110 kV trở lên"
          }
        ],
        "operator": "OR"
      }
    },
    {
      "stt": "6",
      "tenThietBi": "Các trạm điện thử nghiệm dùng máy phát điện diezel, xăng thiết kế trên xe ô tô hoặc rơ moóc",
      "shortName": "Trạm điện thử nghiệm diezel/xăng trên xe",
      "baoChayCriteria": {
        "type": "khongPhuThuocDienTich",
        "description": "Không phụ thuộc vào diện tích"
      },
      "chuaChayCriteria": {
        "type": "khong",
        "description": "-"
      }
    }
  ]
};
