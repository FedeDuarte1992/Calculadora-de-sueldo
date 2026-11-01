const SALARY_TABLES = {
    hourly: {
        A: { enero25: 2546, febrero25: 2583, marzo25: 2621, abril25: 2658, mayo25: 2696, junio25: 2750, julio25: 2804, agosto25: 2858, septiembre25: 2912, octubre25: 2966, noviembre25: 3020, diciembre25: 3080, enero26: 3141, febrero26: 3141, marzo26: 3231, abril26: 3231, mayo26: 3231, junio26: 3231, julio26: 3279, agosto26: 3328, septiembre26: 3376, octubre26: 3425, noviembre26: 3489, diciembre26: 3554 },
        B: { enero25: 2593, febrero25: 2631, marzo25: 2669, abril25: 2707, mayo25: 2745, junio25: 2800, julio25: 2855, agosto25: 2910, septiembre25: 2965, octubre25: 3020, noviembre25: 3074, diciembre25: 3135, enero26: 3197, febrero26: 3197, marzo26: 3289, abril26: 3289, mayo26: 3289, junio26: 3289, julio26: 3338, agosto26: 3388, septiembre26: 3437, octubre26: 3486, noviembre26: 3552, diciembre26: 3618 },
        C: { enero25: 2643, febrero25: 2682, marzo25: 2721, abril25: 2759, mayo25: 2798, junio25: 2854, julio25: 2910, agosto25: 2966, septiembre25: 3022, octubre25: 3078, noviembre25: 3134, diciembre25: 3197, enero26: 3259, febrero26: 3259, marzo26: 3353, abril26: 3353, mayo26: 3353, junio26: 3353, julio26: 3403, agosto26: 3454, septiembre26: 3504, octubre26: 3554, noviembre26: 3621, diciembre26: 3688 },
        D: { enero25: 2690, febrero25: 2729, marzo25: 2769, abril25: 2808, mayo25: 2848, junio25: 2905, julio25: 2962, agosto25: 3019, septiembre25: 3076, octubre25: 3133, noviembre25: 3190, diciembre25: 3254, enero26: 3318, febrero26: 3318, marzo26: 3413, abril26: 3413, mayo26: 3413, junio26: 3413, julio26: 3464, agosto26: 3515, septiembre26: 3567, octubre26: 3618, noviembre26: 3686, diciembre26: 3754 },
        E: { enero25: 2745, febrero25: 2785, marzo25: 2826, abril25: 2866, mayo25: 2906, junio25: 2964, julio25: 3022, agosto25: 3080, septiembre25: 3138, octubre25: 3197, noviembre25: 3255, diciembre25: 3320, enero26: 3385, febrero26: 3385, marzo26: 3483, abril26: 3483, mayo26: 3483, junio26: 3483, julio26: 3535, agosto26: 3587, septiembre26: 3640, octubre26: 3692, noviembre26: 3762, diciembre26: 3831 },
        F: { enero25: 2798, febrero25: 2839, marzo25: 2880, abril25: 2921, mayo25: 2962, junio25: 3021, julio25: 3080, agosto25: 3140, septiembre25: 3199, octubre25: 3258, noviembre25: 3317, diciembre25: 3383, enero26: 3450, febrero26: 3450, marzo26: 3549, abril26: 3549, mayo26: 3549, junio26: 3549, julio26: 3602, agosto26: 3655, septiembre26: 3709, octubre26: 3762, noviembre26: 3833, diciembre26: 3904 },
        G: { enero25: 2885, febrero25: 2927, marzo25: 2969, abril25: 3012, mayo25: 3054, junio25: 3115, julio25: 3176, agosto25: 3237, septiembre25: 3298, octubre25: 3359, noviembre25: 3420, diciembre25: 3488, enero26: 3557, febrero26: 3557, marzo26: 3659, abril26: 3659, mayo26: 3659, junio26: 3659, julio26: 3714, agosto26: 3769, septiembre26: 3824, octubre26: 3879, noviembre26: 3952, diciembre26: 4025 },
        H: { enero25: 2947, febrero25: 2990, marzo25: 3033, abril25: 3077, mayo25: 3120, junio25: 3182, julio25: 3245, agosto25: 3307, septiembre25: 3370, octubre25: 3432, noviembre25: 3494, diciembre25: 3564, enero26: 3634, febrero26: 3634, marzo26: 3739, abril26: 3739, mayo26: 3739, junio26: 3739, julio26: 3795, agosto26: 3851, septiembre26: 3907, octubre26: 3963, noviembre26: 4038, diciembre26: 4113 }
    },
    seniority: {
        1: { enero25: 25, julio25: 27, septiembre25: 28, enero26: 29, marzo26: 30, abril26: 30, mayo26: 30, junio26: 30, julio26: 30, agosto26: 32, septiembre26: 32, octubre26: 33, noviembre26: 33, diciembre26: 33 },
        3: { enero25: 37, julio25: 39, septiembre25: 41, enero26: 42, marzo26: 43, abril26: 44, mayo26: 44, junio26: 44, julio26: 44, agosto26: 46, septiembre26: 46, octubre26: 48, noviembre26: 48, diciembre26: 48 },
        5: { enero25: 50, julio25: 53, septiembre25: 56, enero26: 58, marzo26: 60, abril26: 60, mayo26: 60, junio26: 60, julio26: 60, agosto26: 63, septiembre26: 63, octubre26: 66, noviembre26: 66, diciembre26: 66 },
        7: { enero25: 68, julio25: 72, septiembre25: 76, enero26: 78, marzo26: 81, abril26: 81, mayo26: 81, junio26: 81, julio26: 81, agosto26: 85, septiembre26: 85, octubre26: 89, noviembre26: 89, diciembre26: 89 },
        9: { enero25: 81, julio25: 86, septiembre25: 91, enero26: 93, marzo26: 96, abril26: 97, mayo26: 97, junio26: 97, julio26: 97, agosto26: 102, septiembre26: 102, octubre26: 107, noviembre26: 107, diciembre26: 107 },
        12: { enero25: 108, julio25: 114, septiembre25: 121, enero26: 124, marzo26: 128, abril26: 129, mayo26: 129, junio26: 129, julio26: 129, agosto26: 135, septiembre26: 135, octubre26: 142, noviembre26: 142, diciembre26: 142 },
        15: { enero25: 130, julio25: 138, septiembre25: 146, enero26: 150, marzo26: 155, abril26: 156, mayo26: 156, junio26: 156, julio26: 156, agosto26: 164, septiembre26: 164, octubre26: 172, noviembre26: 172, diciembre26: 172 },
        18: { enero25: 152, julio25: 161, septiembre25: 170, enero26: 174, marzo26: 179, abril26: 182, mayo26: 182, junio26: 182, julio26: 182, agosto26: 191, septiembre26: 191, octubre26: 200, noviembre26: 200, diciembre26: 200 },
        22: { enero25: 175, julio25: 186, septiembre25: 196, enero26: 201, marzo26: 207, abril26: 210, mayo26: 210, junio26: 210, julio26: 210, agosto26: 221, septiembre26: 221, octubre26: 231, noviembre26: 231, diciembre26: 231 },
        26: { enero25: 198, julio25: 210, septiembre25: 222, enero26: 228, marzo26: 235, abril26: 238, mayo26: 238, junio26: 238, julio26: 238, agosto26: 250, septiembre26: 250, octubre26: 262, noviembre26: 262, diciembre26: 262 },
        30: { enero25: 217, julio25: 230, septiembre25: 243, enero26: 249, marzo26: 256, abril26: 260, mayo26: 260, junio26: 260, julio26: 260, agosto26: 273, septiembre26: 273, octubre26: 286, noviembre26: 286, diciembre26: 286 },
        35: { enero25: 238, julio25: 252, septiembre25: 267, enero26: 273, marzo26: 281, abril26: 286, mayo26: 286, junio26: 286, julio26: 286, agosto26: 300, septiembre26: 300, octubre26: 315, noviembre26: 315, diciembre26: 315 },
        40: { enero25: 261, julio25: 277, septiembre25: 292, enero26: 300, marzo26: 309, abril26: 312, mayo26: 312, junio26: 312, julio26: 312, agosto26: 328, septiembre26: 328, octubre26: 343, noviembre26: 343, diciembre26: 343 }
    },
    nonRemunerative: {
        enero25: 210000, febrero25: 210000, marzo25: 210000, abril25: 210000, mayo25: 210000, junio25: 315000,
        julio25: 210000, agosto25: 210000, septiembre25: 210000, octubre25: 210000, noviembre25: 210000, diciembre25: 315000,
        enero26: 210000, febrero26: 210000, marzo26: 210000, abril26: 225000, mayo26: 240000, junio26: 360000,
        julio26: 243600, agosto26: 247200, septiembre26: 250800, octubre26: 254400, noviembre26: 259200, diciembre26: 264000
    },
    deferredNonRemunerative: {
        diciembre26: 132000
    }
};
