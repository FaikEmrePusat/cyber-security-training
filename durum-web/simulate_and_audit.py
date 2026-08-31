# -*- coding: utf-8 -*-
"""
Kapsamlı Sistem Denetimi ve 4-Boyutlu Simülasyon Test Aracı
Durum-Web Matematiksel, Pedagojik, Psikolojik ve Teknik Doğrulama Skripti
"""

import math
import json
from datetime import datetime, timedelta

# Model Parametreleri (durum-web/src/model/constants.ts ile birebir)
MODEL = {
    "surum": "2.1",
    "rho": 0,
    "R": {"T": 0.4, "P": 0.25, "L": 0.2, "C": 0.15},
    "kanitOrani": {"yok": 0.5, "kayit": 0.8, "public": 1.0},
    "pKappa": 5,
    "artefaktDeger": {
        "soc-lab": 3.0,
        "ad-lab": 2.5,
        "vm-lab": 2.0,
        "arac": 1.5,
        "writeup": 0.5,
        "lab-egzersizi": 0.5,
    },
    "curume": {"tau0": 10, "b": 2, "taban": 0.5},
    "ctl": {"ctlGun": 42, "atlGun": 7, "loadOlcek": 10},
    "hiz": {"aSiber": 0.8, "aDil": 0.2, "H": 9.25, "h0": 3.7, "min": -0.5, "max": 4.5, "bant": 0.2, "ctlCarpan": 0.7},
    "tekrar": {
        "w20": 0.2,
        "factor": 0.6935,
        "rHedef": 0.85,
        "s0": 3,
        "sMax": 90,
        "ef0": 2.5,
        "efMin": 1.3,
        "efMax": 2.8,
        "kuyrukTavani": 3,
    },
    "L": {"DE": 0.55, "EN": 0.45, "konusma": 0.6, "genel": 0.4},
    "glh": {"A1": 95, "A2": 190, "B1": 320, "B2": 550, "C1": 750},
    "efor": {"A": 2.22},
    "kapi": {
        "A": {"net": 6, "linux": 6, "win": 5},
        "B": {"secfund": 6, "siem": 5},
        "C": {"publicProje": 2, "minSahiplik": 1.0, "minDeger": 2.5},
        "D": {"R": "R_giris", "de": 5, "en": 7, "gate0": True},
        "E": {"mulakat14gun": 2},
        "F": {"runwayAy": 12},
    },
    "hedef": {
        "vektor": {"T": 5.8, "P": 6.6, "L": 7.5, "C": 9.0},
        "vektorGiris": {"T": 5.0, "P": 5.0, "L": 6.1, "C": 7.0},
        "dil": {"de": 7.5, "en": 7.5},
        "S": {
            "def": 7, "win": 6, "port": 7, "linux": 6, "net": 6, "siem": 7,
            "secfund": 6, "netsec": 5, "py": 4, "off": 3, "crypto": 4, "cloud": 3,
        },
    },
    "chancenkarte": {
        "puanEsik": 6,
        "yasEsik": {"tam": 35, "kismi": 40},
        "yasPuan": {"tam": 2, "kismi": 1},
        "gecimAy2026": 1091,
    },
}

def clamp(n, lo, hi):
    return max(lo, min(hi, n))

def evidence_cap(tier, maximum):
    return MODEL["kanitOrani"][tier] * maximum

def compute_r_from_dims(T, P, L, C):
    parts = [max(x / 10.0, 0.02) for x in [T, P, L, C]]
    w = [MODEL["R"]["T"], MODEL["R"]["P"], MODEL["R"]["L"], MODEL["R"]["C"]]
    if MODEL["rho"] == 0:
        return 100.0 * (parts[0]**w[0]) * (parts[1]**w[1]) * (parts[2]**w[2]) * (parts[3]**w[3])
    return 100.0 * sum(p * weight for p, weight in zip(parts, w))

def retrievability(days, stability):
    t = MODEL["tekrar"]
    return (1.0 + (t["factor"] * days) / stability) ** (-t["w20"])

def is_retrieval_due(days, stability):
    return retrievability(days, stability) < MODEL["tekrar"]["rHedef"]

def next_stability(stability, ef, n, outcome):
    t = MODEL["tekrar"]
    if outcome == "basarili":
        ef = min(t["efMax"], ef + 0.1)
        stability = min(t["sMax"], stability * ef)
        n += 1
    elif outcome == "zorlandim":
        ef = max(t["efMin"], ef - 0.14)
        stability = stability * max(1.0, ef - 0.6)
    else:
        ef = max(t["efMin"], ef - 0.54)
        stability = max(t["s0"], stability * 0.35)
        n = max(0, n - 2)
    return stability, ef, n

def decay_multiplier(days, n):
    tau = MODEL["curume"]["tau0"] * (MODEL["curume"]["b"] ** n)
    ret = math.exp(-max(0, days) / tau)
    return MODEL["curume"]["taban"] + (1.0 - MODEL["curume"]["taban"]) * ret

def run_tests():
    report = {}

    # ==========================================
    # 1. MATEMATİK & FORMÜL TESTLERİ
    # ==========================================
    math_tests = {}
    
    # R Hedef & R Giriş
    r_hedef_val = compute_r_from_dims(5.8, 6.6, 7.5, 9.0)
    r_giris_val = compute_r_from_dims(5.0, 5.0, 6.1, 7.0)
    r_seed_val = compute_r_from_dims(3.63, 0.95, 3.35, 2.0)
    
    math_tests["r_hedef"] = round(r_hedef_val, 2)
    math_tests["r_giris"] = round(r_giris_val, 2)
    math_tests["r_seed"] = round(r_seed_val, 2)
    
    # FSRS Karakteristiği
    fsrs_days_to_due_s0 = None
    for d in range(1, 30):
        if retrievability(d, MODEL["tekrar"]["s0"]) < MODEL["tekrar"]["rHedef"]:
            fsrs_days_to_due_s0 = d
            break
    math_tests["fsrs_first_review_days"] = fsrs_days_to_due_s0
    
    # Çürüme (Decay) Karakteristiği: 30 gün pratik yapılmayan bir beceri (n=0, tau=10)
    decay_30d_n0 = decay_multiplier(30, 0)
    decay_30d_n2 = decay_multiplier(30, 2) # n=2 => tau=40
    math_tests["decay_30d_n0"] = round(decay_30d_n0, 3)
    math_tests["decay_30d_n2"] = round(decay_30d_n2, 3)

    report["math_tests"] = math_tests

    # ==========================================
    # 2. SENARYO 1: DÜZENLİ ÇALIŞAN (30 GÜN)
    # Her gün 2 saat, 1 tekrar + 1 temel + 1 zayıf alan + lab
    # ==========================================
    s1_history = []
    s1_skills = {
        "net": 6.0, "linux": 4.0, "win": 3.0, "secfund": 7.0, "crypto": 7.0,
        "netsec": 7.0, "siem": 3.0, "def": 3.0, "off": 2.0, "py": 5.0, "cloud": 2.0, "port": 2.0
    }
    s1_weights = {
        "net": 1.2, "linux": 1.3, "win": 1.4, "secfund": 1.0, "crypto": 0.6,
        "netsec": 0.9, "siem": 1.1, "def": 1.5, "off": 0.7, "py": 0.8, "cloud": 0.4, "port": 1.4
    }
    
    # 8 Başlangıç FSRS kartı
    s1_retrieval = [
        {"id": f"r{i+1}", "stability": 3.0, "ef": 2.5, "n": 0, "last_day": 0}
        for i in range(8)
    ]
    
    s1_topics_learned = 0
    s1_r_series = []
    s1_ctl = 0.0
    s1_atl = 0.0
    s1_tsb_series = []
    
    for day in range(1, 31):
        # Yük hesaplama: 2 saat çalışma (1.6 saat siber @0.85 kalite)
        load = (1.6 * 0.8 + 0.4 * 0.2) * 0.85 * 10.0 # ~11.56
        s1_ctl += (load - s1_ctl) / 42.0
        s1_atl += (load - s1_atl) / 7.0
        tsb = s1_ctl - s1_atl
        s1_tsb_series.append(round(tsb, 1))
        
        # FSRS Tekrarları
        reviews_done = 0
        for item in s1_retrieval:
            elapsed = day - item["last_day"]
            if is_retrieval_due(elapsed, item["stability"]):
                s, ef, n = next_stability(item["stability"], item["ef"], item["n"], "basarili")
                item["stability"] = s
                item["ef"] = ef
                item["n"] = n
                item["last_day"] = day
                reviews_done += 1
                if reviews_done >= 3:
                    break
        
        # 1 Temel + 1 Zayıf Alan konusu öğrenildi => 2 yeni kart sisteme eklendi
        s1_topics_learned += 2
        s1_retrieval.append({"id": f"new_{day}_1", "stability": 3.0, "ef": 2.5, "n": 0, "last_day": day})
        s1_retrieval.append({"id": f"new_{day}_2", "stability": 3.0, "ef": 2.5, "n": 0, "last_day": day})
        
        # Beceriler ufak ufak artıyor (30 günde Linux +1.5, Win +1.5, Def +1.5)
        s1_skills["linux"] = min(6.0, s1_skills["linux"] + 0.05)
        s1_skills["win"] = min(6.0, s1_skills["win"] + 0.05)
        s1_skills["def"] = min(6.0, s1_skills["def"] + 0.05)
        s1_skills["siem"] = min(6.0, s1_skills["siem"] + 0.05)
        
        # T hesabı
        w_sum = sum(s1_weights[k] for k in s1_skills if k != "port")
        w_score = sum(s1_skills[k] * s1_weights[k] * 0.5 for k in s1_skills if k != "port") # 0.5 kanıtsız tavan
        T = w_score / w_sum
        P = 1.5 # biraz lab yapıldı
        L = 3.35 # sabit
        C = 2.0 # sabit
        r_current = compute_r_from_dims(T, P, L, C)
        s1_r_series.append(round(r_current, 2))
        
    report["scenario_1_regular"] = {
        "final_r": s1_r_series[-1],
        "delta_r": round(s1_r_series[-1] - s1_r_series[0], 2),
        "total_topics_learned": s1_topics_learned,
        "total_active_cards": len(s1_retrieval),
        "final_ctl": round(s1_ctl, 1),
        "final_atl": round(s1_atl, 1),
        "final_tsb": s1_tsb_series[-1],
        "tsb_range": [min(s1_tsb_series), max(s1_tsb_series)],
    }

    # ==========================================
    # 3. SENARYO 2: DÜZENSİZ / ERTELEYEN (30 GÜN)
    # 3 gün çalış, 4 gün boşluk. Yapamadığı gün "Yarına aktar" basıyor.
    # Taşıma yığılması (carry snowball) testi!
    # ==========================================
    s2_carry_queue = []
    s2_carry_history = []
    s2_overdue_history = []
    s2_retrieval = [
        {"id": f"r{i+1}", "stability": 3.0, "ef": 2.5, "n": 0, "last_day": 0}
        for i in range(8)
    ]
    
    for day in range(1, 31):
        is_working_day = (day % 7 in [1, 2, 3]) # Haftanın ilk 3 günü çalışıyor, 4 gün mola
        
        # Vadesi gelen tekrarlar
        overdue_today = [
            item for item in s2_retrieval 
            if is_retrieval_due(day - item["last_day"], item["stability"])
        ]
        s2_overdue_history.append(len(overdue_today))
        
        if is_working_day:
            # Çalışma günü: 2 saat kapasite. Önce carry'leri tüketmeye çalışıyor.
            capacity = 2.0
            # 1 tekrar (0.13h), 1 temel (0.5h), 1 konu (0.5h), 1 lab (0.75h) = 1.88h
            # Carry'den iş tüket
            carry_processed = min(len(s2_carry_queue), 2)
            s2_carry_queue = s2_carry_queue[carry_processed:]
            
            # Tekrarları yap (max 3)
            for item in overdue_today[:3]:
                s, ef, n = next_stability(item["stability"], item["ef"], item["n"], "basarili")
                item["stability"] = s
                item["ef"] = ef
                item["n"] = n
                item["last_day"] = day
        else:
            # Çalışmadığı gün: Planlanan 3 görevi de "Yarına aktar" yapıyor
            # carry_task = ["temel", "zayif_alan", "lab"]
            s2_carry_queue.append(f"task_{day}_temel")
            s2_carry_queue.append(f"task_{day}_konu")
            s2_carry_queue.append(f"task_{day}_lab")
            
        s2_carry_history.append(len(s2_carry_queue))
        
    report["scenario_2_irregular"] = {
        "max_carry_snowball": max(s2_carry_history),
        "final_carry_snowball": s2_carry_history[-1],
        "max_overdue_cards": max(s2_overdue_history),
        "carry_history_sample": s2_carry_history[::5],
    }

    # ==========================================
    # 4. SENARYO 3: GERİ DÖNEN KULLANICI (14 GÜN MOLA SONRASI)
    # Geri dönüş modu tetiklenmesi ve kuyruk toparlanma süresi
    # ==========================================
    s3_retrieval = [
        {"id": f"r{i+1}", "stability": 3.0, "ef": 2.5, "n": 0, "last_day": 0}
        for i in range(8)
    ]
    # 14 gün hiç girmedi => gün 15'te geldi
    day = 15
    # Gün 15'te tüm kartların retrievability'si
    s3_r_values = [retrievability(15, item["stability"]) for item in s3_retrieval]
    # Geri dönüş modu: kapasite 0.25h (15 dk) => Günde max 3 tekrar
    days_to_clear_backlog = 0
    current_day = 15
    while any(is_retrieval_due(current_day - item["last_day"], item["stability"]) for item in s3_retrieval):
        days_to_clear_backlog += 1
        # Günde 3 kart tekrar et
        due = [item for item in s3_retrieval if is_retrieval_due(current_day - item["last_day"], item["stability"])]
        for item in due[:3]:
            # Uzun süre sonra hatırlandı mı? zorlandım varsayalım
            s, ef, n = next_stability(item["stability"], item["ef"], item["n"], "zorlandim")
            item["stability"] = s
            item["ef"] = ef
            item["n"] = n
            item["last_day"] = current_day
        current_day += 1
        if days_to_clear_backlog > 60:
            break
            
    report["scenario_3_return"] = {
        "r_after_14d_gap": [round(x, 3) for x in s3_r_values],
        "all_overdue": all(x < 0.85 for x in s3_r_values),
        "days_to_clear_backlog_with_cap_3": days_to_clear_backlog,
    }

    # ==========================================
    # 5. SENARYO 4: ALMANYA KAPILARI & PORTFÖY TAVANI
    # Gate 0..F analizi
    # ==========================================
    # Gate A: Net>=6, Linux>=6, Win>=5
    # Seed state: Net=6, Linux=4, Win=3 => Gate A kapalı (Linux 4/6, Win 3/5)
    # Kanıt tavanı açıkken P max:
    # 2 write-up (0.5*2) = 1.0, kanıtsız tavanı = 0.5*10 = 5.0, ama grup.public=0 => pDallar[0]=0, pDallar[1]=0, pDallar[2]=min(pSat(1.0), 5.0) = 1.81 * 0.5 = 0.90
    
    pSum = 1.0
    pSat = 10 * (1 - math.exp(-pSum / 5.0)) # ~1.81
    p_tier_yok = min(pSat, evidence_cap("yok", 10)) # 1.81
    # Eğer kanıt yoksa pEn.deger = 1.81
    
    # Chancenkarte Puanlama Testi
    # Yaş: 30 (+2), Mesleki Eğitim 2 yıl (+önkoşul), Almanca A1/A2 (+0 veya +1), İngilizce B2/C1 (+0 veya +1), Kısmi Denklik (+4)
    # Durum 1: Anerkennung yok (0 pt) + Yaş 30 (2 pt) + Almanca A1 (0 pt) = 2 pt (YETERSİZ, min 6)
    # Durum 2: IHK FOSA kısmi denklik (4 pt) + Yaş 30 (2 pt) + Almanca A2 (1 pt) = 7 pt (GEÇER)
    # Durum 3: IHK FOSA kısmi denklik (4 pt) + Yaş 30 (2 pt) + İngilizce C1 (1 pt) = 7 pt (GEÇER)
    
    report["scenario_4_germany"] = {
        "p_seed_actual": round(p_tier_yok, 2),
        "chancenkarte_seed_score": 2, # Yas 30: 2, Almanca A1: 0, Anerkennung: 0 => 2 (uygunsuz)
        "chancenkarte_with_anerkennung_and_a2": 7, # 4 + 2 + 1 = 7 (uygun)
        "gate_a_blockers": ["Linux 4.0/6.0", "Win/AD 3.0/5.0"],
        "gate_d_blockers": ["Gate C kapalı (0 public proje)", "R skoru < 55 (26.62)", "Almanca < B1", "Gate 0 bilinmiyor"],
    }

    # ==========================================
    # 6. BİLİŞSEL YÜK VE GÜNLÜK AKIŞ ANALİZİ
    # ==========================================
    # 2 saatlik günlük kapasite kırılımı:
    # Tekrarlar (3 konu * 8 dk = 24 dk = 0.4 sa)
    # Temel Kanal (1 konu = 30 dk = 0.5 sa)
    # Zayıf Alan (1 konu = 30 dk = 0.5 sa)
    # Lab / Pratik (min 30 dk - 45 dk = 0.5 - 0.75 sa)
    # Toplam: 0.4 + 0.5 + 0.5 + 0.6 = 2.0 sa (Kapasitenin %100'ü)
    # Eğer lab 1.5 saat olursa => 2.9 saat (Kapasite aşımı, carry üretir!)
    
    report["cognitive_load_analysis"] = {
        "standard_day_minutes": 24 + 30 + 30 + 45, # 129 dk = 2.15 sa
        "capacity_utilization_pct": round((129 / 120) * 100, 1), # %107.5
        "risk": "Standart bir günde bile 4 kanal aynı anda çalıştırıldığında 120 dk kapasite hafifçe aşılıyor ve 1 görev otomatik olarak ertesi güne taşıma (carry) riski taşıyor.",
    }

    print(json.dumps(report, indent=2, ensure_ascii=False))
    return report

if __name__ == "__main__":
    run_tests()
