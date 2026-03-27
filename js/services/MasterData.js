window.MasterData = {
    sakhis: [
        { name: "Smt. Shivdei Devi", mobile: "8650864393", block: "Augustyamuni", village: "Dangi", shg: "Gaura Maa SHG", clf: "Pragti CLF", hospital: "Veterinary Hospital Munnadeval", bank: "SBI Augustyamuni", account: "30868052573", ifsc: "SBIN0003568" },
        { name: "Smt. kusum Devi", mobile: "8171073067", block: "Augustyamuni", village: "Kandara", shg: "Jai Shri Ram", clf: "Ridhi Sidhi CLF", hospital: "Veterinary Hospital Chandrapuri", bank: "SBI Chandrapuri", account: "31861271709", ifsc: "SBIN0008423" },
        { name: "Smt. Aruna Devi", mobile: "9627482998", block: "Jakholi", village: "Saurakhal", shg: "Bala Sundri Utpadak SHG", clf: "Ghandiyal Devta LC", hospital: "Veterinary Hospital Chauriya Bhardhar", bank: "SBI Sourakhal", account: "40026060734", ifsc: "SBIN0018995" },
        { name: "Smt. Beena Devi", mobile: "9627317779", block: "Jakholi", village: "Dharkot", shg: "Jay Badri Vishal SHG", clf: "Mahila Utthan CLF", hospital: "Veterinary Hospital Sumadi Bhardhar", bank: "SBI Mayali", account: "34048123822", ifsc: "SBIN0011502" },
        { name: "Smt. Rekha Devi", mobile: "8057603414", block: "Ukhimath", village: "Giriya", shg: "Durga", clf: "Udan", hospital: "Veterinary Hospital Ukhimath", bank: "UGB Mansuna", account: "76005371567", ifsc: "SBIN0RRUTGB" },
        { name: "Smt. Munni Devi", mobile: "9068422301", block: "Ukhimath", village: "Rampur Nayalshu", shg: "Shiv Shakti", clf: "Dev bhoomi Phata", hospital: "Veterinary Rampur Ukhimath", bank: "Guptkashi", account: "32216494146", ifsc: "SBIN0006736" },
        { name: "Smt. Neema Devi", mobile: "7830244522", block: "Ukhimath", village: "Dungaer", shg: "Veshnavi", clf: "Jiwan Jyoti Daida", hospital: "Veterinary Hospital Ukhimath", bank: "SBI Ukhimath", account: "41282612971", ifsc: "SBIN0002498" },
        { name: "Smt. Rekha Devi", mobile: "8532845881", block: "Augustyamuni", village: "Chinka", shg: "Swavlambi", clf: "Shivshakti CLF Mahad", hospital: "Veterinary Hospital Sadar Rudraprayag", bank: "SBI Goltir", account: "11298557775", ifsc: "SBIN0011500" },
        { name: "Smt. Rajni Devi", mobile: "7466835845", block: "Augustyamuni", village: "Bawai", shg: "Asha", clf: "Unnati CLF", hospital: "Veterinary Hospital Durgadhar", bank: "SBI Chopta", account: "35746777252", ifsc: "SBIN0006790" },
        { name: "Smt. Anju Devi", mobile: "7467853036", block: "Jakholi", village: "Jawadi", shg: "Jay Maa Mathiyana", clf: "Rudranath CLF", hospital: "Veterinary Hospital Sumadi Bhardhar", bank: "Bank of India", account: "721310110004519", ifsc: "BKID0007213" },
        { name: "Smt. Sama Chauhan", mobile: "9761783511", block: "Jakholi", village: "Jakholi", shg: "Nagdev Devta", clf: "Mahila Utthan CLF", hospital: "Veterinary Hospital Jakholi", bank: "SBI Jakholi", account: "11803262340", ifsc: "SBIN0006213" },
        { name: "Smt. Deepa Devi", mobile: "9897937642", block: "Ukhimath", village: "Devshal", shg: "Vindhyavashani", clf: "Nav Kiran CLF Narayankoti", hospital: "Veterinary Hospital Phata", bank: "SBI Guptakashi", account: "34196385222", ifsc: "SBIN0006736" },
        { name: "Smt. Shanta Devshali", mobile: "9675728705", block: "Ukhimath", village: "Devshal", shg: "Durga", clf: "Nav Kiran CLF Narayankoti", hospital: "Veterinary Hospital Phata", bank: "SBI Guptakashi", account: "31017338521", ifsc: "SBIN0006736" },
        { name: "Smt. Geeta Devi", mobile: "9536802661", block: "Ukhimath", village: "Parkandi", shg: "Tungeshwar", clf: "Umang CLF Makkumath", hospital: "Veterinary Hospital Ukhimath", bank: "SBI Bhiri", account: "34774556237", ifsc: "SBIN0009834" },
        { name: "Smt. Sunita Devi", mobile: "8958720275", block: "Jakholi", village: "Taat", shg: "Chetrapal Utpadak SHG", clf: "Sangan CLF", hospital: "Veterinary Hospital Sumadi", bank: "Tehri Garhwal Zila Sahakri Bank", account: "003234001000396", ifsc: "IBKL070TGZS" }
    ],
    getSakhiByMobile: (mobile) => {
        return window.MasterData.sakhis.find(s => s.mobile === mobile);
    },
    blockCenters: {
        "Augustyamuni": { lat: 30.2937, lng: 79.2132 },
        "Jakholi": { lat: 30.2990, lng: 79.2150 },
        "Ukhimath": { lat: 30.5100, lng: 79.0900 }
    }
};
