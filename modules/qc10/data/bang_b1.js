window.BANG_B1_DATA = {
  "metadata": {
    "source": "QCVN 10:2025/BCA",
    "table": "Bảng B.1 - Quy định về trang bị hệ thống họng nước chữa cháy trong nhà",
    "effectiveDate": "2025-12-30",
    "description": "Phụ lục B - Trang bị hệ thống họng nước chữa cháy trong nhà",
    "notes": [
      "Mỗi entry có 'apA1Stt' = danh sách STT của Bảng A.1 (hoặc subStt) mà entry này áp dụng",
      "Trường 'criteria' dùng cùng schema với Bảng A.1 (type/value/multi/operator)"
    ]
  },
  "footnotes": {
    "CHU_THICH_1": "Đối với nhà hỗn hợp, nhà ở riêng lẻ kết hợp kinh doanh dịch vụ, nhà ở riêng lẻ kết hợp sản xuất, kinh doanh hàng hóa dễ cháy không thuộc diện phải trang bị hệ thống họng nước chữa cháy trong nhà nhưng phần công năng bất kỳ của nhà có quy mô thuộc diện phải trang bị hệ thống họng nước chữa cháy trong nhà theo Bảng B.1 thì phải trang bị hệ thống họng nước chữa cháy trong nhà cho phần nhà đó. Đối với nhà hỗn hợp có phần công năng kinh doanh dịch vụ karaoke, vũ trường từ tầng 3 trở lên thì phải trang bị hệ thống họng nước chữa cháy trong nhà cho toàn bộ nhà. Nhà ở riêng lẻ kết hợp kinh doanh dịch vụ, nhà ở riêng lẻ kết hợp sản xuất, kinh doanh hàng hóa dễ cháy có phần diện tích sàn để sản xuất, kinh doanh trên 70% tổng diện tích của nhà trở lên thì việc trang bị họng nước chữa cháy trong nhà thực hiện theo công năng sản xuất, kinh doanh.",
    "CHU_THICH_2": "Cho phép bố trí trang bị hệ thống họng nước chữa cháy đóng gói (Package) thay cho hệ thống họng nước chữa cháy trong các công trình quy định tại Phụ lục A TCVN 13926.",
    "CHU_THICH_3": "Không trang bị hệ thống họng nước chữa cháy trong nhà đối với nhà sản xuất, nhà kho có sử dụng hay bảo quản các chất khi tiếp xúc với nước có thể sinh ra cháy, nổ, ngọn lửa lan truyền."
  },
  "entries": [
    {
      "stt": "1.1",
      "loaiNha": "Nhà ở riêng lẻ kết hợp kinh doanh dịch vụ / sản xuất, kinh doanh hàng hóa dễ cháy (phần SXKD ≤70% tổng DTS)",
      "apA1Stt": [
        "1",
        "2"
      ],
      "criteria": {
        "type": "tangTroLen",
        "value": 7,
        "unit": "tầng",
        "description": "Cao từ 7 tầng trở lên"
      }
    },
    {
      "stt": "1.2",
      "loaiNha": "Chung cư, nhà chung cư hỗn hợp, nhà ở tập thể, KTX giáo dục; khách sạn, nhà khách, nhà nghỉ, cơ sở lưu trú; nhà hỗn hợp",
      "apA1Stt": [
        "3",
        "18",
        "21"
      ],
      "criteria": {
        "type": "multi",
        "conditions": [
          {
            "type": "tangTroLen",
            "value": 5,
            "unit": "tầng",
            "description": "Cao từ 5 tầng trở lên"
          },
          {
            "type": "dtsTroLen",
            "value": 1500,
            "unit": "m²",
            "description": "Tổng DTS từ 1 500 m² trở lên"
          }
        ],
        "operator": "OR"
      }
    },
    {
      "stt": "1.3",
      "loaiNha": "Nhà trẻ, trường mẫu giáo, trường mầm non và cơ sở giáo dục mầm non khác",
      "apA1Stt": [
        "4"
      ],
      "criteria": {
        "type": "multi",
        "conditions": [
          {
            "type": "soChauTroLen",
            "value": 100,
            "unit": "cháu",
            "description": "Từ 100 cháu trở lên"
          },
          {
            "type": "tangTroLen",
            "value": 3,
            "unit": "tầng",
            "description": "Cao từ 3 tầng trở lên"
          },
          {
            "type": "dtsTroLen",
            "value": 1000,
            "unit": "m²",
            "description": "Tổng DTS từ 1 000 m² trở lên"
          }
        ],
        "operator": "OR"
      }
    },
    {
      "stt": "1.4",
      "loaiNha": "Trường học (tiểu học → đại học, dạy nghề, GD khác) và nhà khám/chữa bệnh, lưu trú bệnh nhân, trạm y tế, phòng khám, điều dưỡng, phục hồi chức năng, phòng chống dịch bệnh",
      "apA1Stt": [
        "5",
        "6"
      ],
      "criteria": {
        "type": "multi",
        "conditions": [
          {
            "type": "tangTroLen",
            "value": 3,
            "unit": "tầng",
            "description": "Cao từ 3 tầng trở lên"
          },
          {
            "type": "dtsTroLen",
            "value": 600,
            "unit": "m²",
            "description": "Tổng DTS từ 600 m² trở lên"
          }
        ],
        "operator": "OR"
      }
    },
    {
      "stt": "1.5",
      "loaiNha": "Thủy cung, kinh doanh dịch vụ vui chơi giải trí, biểu diễn nghệ thuật, hoạt động văn hóa; bảo tàng, triển lãm, trưng bày; tôn giáo, tín ngưỡng, di tích lịch sử cấp tỉnh trở lên; sân vận động, nhà thi đấu, tập luyện thể thao; xưởng kiểm định đăng kiểm",
      "apA1Stt": [
        "8",
        "11",
        "14",
        "16",
        "24"
      ],
      "criteria": {
        "type": "multi",
        "conditions": [
          {
            "type": "tangTroLen",
            "value": 6,
            "unit": "tầng",
            "description": "Cao từ 6 tầng trở lên"
          },
          {
            "type": "dtsTroLen",
            "value": 1500,
            "unit": "m²",
            "description": "Tổng DTS từ 1 500 m² trở lên"
          }
        ],
        "operator": "OR"
      }
    },
    {
      "stt": "1.6",
      "loaiNha": "Nhà hát, rạp chiếu phim, rạp xiếc",
      "apA1Stt": [
        "9"
      ],
      "criteria": {
        "type": "multi",
        "conditions": [
          {
            "type": "choTroLen",
            "value": 300,
            "unit": "chỗ",
            "description": "Từ 300 chỗ ngồi trở lên"
          },
          {
            "type": "dtsTroLen",
            "value": 1000,
            "unit": "m²",
            "description": "Tổng DTS từ 1 000 m² trở lên"
          }
        ],
        "operator": "OR"
      }
    },
    {
      "stt": "1.7",
      "loaiNha": "Thư viện; nhà văn hóa, trung tâm hội nghị, nhà đa năng; cửa hàng điện máy, bách hóa, tiện ích và cửa hàng kinh doanh hàng hóa dễ cháy",
      "apA1Stt": [
        "10",
        "12",
        "17"
      ],
      "criteria": {
        "type": "dtsTroLen",
        "value": 1500,
        "unit": "m²",
        "description": "Tổng DTS từ 1 500 m² trở lên"
      }
    },
    {
      "stt": "1.8",
      "loaiNha": "Trụ sở, văn phòng làm việc, cơ sở nghiên cứu chuyên ngành; bưu điện, bưu cục, cơ sở bưu chính-viễn thông",
      "apA1Stt": [
        "19",
        "20"
      ],
      "criteria": {
        "type": "multi",
        "conditions": [
          {
            "type": "tangTroLen",
            "value": 6,
            "unit": "tầng",
            "description": "Cao từ 6 tầng trở lên"
          },
          {
            "type": "dtsTroLen",
            "value": 1500,
            "unit": "m²",
            "description": "Tổng DTS từ 1 500 m² trở lên"
          }
        ],
        "operator": "OR"
      }
    },
    {
      "stt": "1.9",
      "loaiNha": "Karaoke, vũ trường",
      "apA1Stt": [
        "13"
      ],
      "subTypes": [
        {
          "subStt": "1.9.1",
          "apA1SubStt": [
            "13.1"
          ],
          "description": "Bố trí tại tầng hầm, tầng bán hầm",
          "criteria": {
            "type": "khongPhuThuocDienTich",
            "description": "Không phụ thuộc vào diện tích"
          }
        },
        {
          "subStt": "1.9.2.1",
          "apA1SubStt": [
            "13.2.1"
          ],
          "description": "Bố trí trên mặt đất - một tầng, hai tầng",
          "criteria": {
            "type": "dtsTroLen",
            "value": 300,
            "unit": "m²",
            "description": "Tổng DTS từ 300 m² trở lên"
          }
        },
        {
          "subStt": "1.9.2.2",
          "apA1SubStt": [
            "13.2.2"
          ],
          "description": "Bố trí trên mặt đất - từ ba tầng trở lên",
          "criteria": {
            "type": "khongPhuThuocDienTich",
            "description": "Không phụ thuộc vào diện tích"
          }
        }
      ]
    },
    {
      "stt": "1.10",
      "loaiNha": "Chợ hạng 1, chợ hạng 2, trung tâm thương mại, siêu thị (trừ các nhà trưng bày bán xe ô tô, xe máy)",
      "apA1Stt": [
        "15"
      ],
      "criteria": {
        "type": "khongPhuThuocDienTich",
        "description": "Không phụ thuộc vào diện tích"
      }
    },
    {
      "stt": "1.11",
      "loaiNha": "Nhà hàng, cửa hàng ăn uống, nhà ăn của cơ sở thuộc diện quản lý PCCC",
      "apA1Stt": [
        "16"
      ],
      "criteria": {
        "type": "multi",
        "conditions": [
          {
            "type": "tangTroLen",
            "value": 6,
            "unit": "tầng",
            "description": "Cao từ 6 tầng trở lên"
          },
          {
            "type": "dtsTroLen",
            "value": 1500,
            "unit": "m²",
            "description": "Tổng DTS từ 1 500 m² trở lên"
          }
        ],
        "operator": "OR"
      }
    },
    {
      "stt": "1.12",
      "loaiNha": "Đài kiểm soát không lưu; nhà ga HK/HH thuộc cảng hàng không; ga hàng hóa, depot đường sắt; ga cáp treo; ga HK, depot đường sắt đô thị; nhà dịch vụ thuộc cảng, bến thủy nội địa, bến cảng biển, bến xe khách, trạm dừng nghỉ, cảng cạn",
      "apA1Stt": [
        "22",
        "23"
      ],
      "criteria": {
        "type": "multi",
        "conditions": [
          {
            "type": "tangTroLen",
            "value": 6,
            "unit": "tầng",
            "description": "Cao từ 6 tầng trở lên"
          },
          {
            "type": "dtsTroLen",
            "value": 1500,
            "unit": "m²",
            "description": "Tổng DTS từ 1 500 m² trở lên"
          }
        ],
        "operator": "OR"
      }
    },
    {
      "stt": "2",
      "loaiNha": "Nhà sản xuất, nhà kho hạng nguy hiểm cháy và cháy nổ A, B, C, D",
      "apA1Stt": [
        "30",
        "31"
      ],
      "criteria": {
        "type": "dtsTroLen",
        "value": 500,
        "unit": "m²",
        "description": "Tổng DTS từ 500 m² trở lên"
      },
      "footnotes": [
        "CHU_THICH_3"
      ]
    },
    {
      "stt": "3",
      "loaiNha": "Nhà để xe ô tô, xe máy, trưng bày ô tô, xe máy",
      "apA1Stt": [
        "25"
      ],
      "subTypes": [
        {
          "subStt": "3.1",
          "description": "Dạng kín",
          "apA1SubStt": [
            "25.1",
            "25.2.1",
            "25.2.2",
            "25.2.3",
            "25.2.4",
            "25.2.5"
          ],
          "criteria": {
            "type": "dtsTroLen",
            "value": 150,
            "unit": "m²",
            "description": "Tổng DTS từ 150 m² trở lên"
          }
        },
        {
          "subStt": "3.2",
          "description": "Dạng hở (ngoại trừ gara ô tô cơ khí)",
          "apA1SubStt": [
            "25.3.1",
            "25.3.2"
          ],
          "criteria": {
            "type": "dtsTroLen",
            "value": 1000,
            "unit": "m²",
            "description": "Tổng DTS từ 1 000 m² trở lên"
          }
        }
      ]
    },
    {
      "stt": "4",
      "loaiNha": "Hầm giao thông đường bộ (hầm đường ô tô)",
      "apA1Stt": [
        "28"
      ],
      "criteria": {
        "type": "chieuDaiTroLen",
        "value": 500,
        "unit": "m",
        "description": "Chiều dài từ 500 m trở lên"
      }
    },
    {
      "stt": "5",
      "loaiNha": "Nhà kỹ thuật máy bay; cơ sở đóng mới, sửa chữa, bảo dưỡng phương tiện thủy nội địa, tàu biển; nhà sửa chữa, bảo dưỡng phương tiện giao thông cơ giới đường bộ",
      "apA1Stt": [
        "27"
      ],
      "criteria": {
        "type": "dtsTroLen",
        "value": 1000,
        "unit": "m²",
        "description": "Tổng DTS từ 1 000 m² trở lên"
      }
    }
  ]
};
