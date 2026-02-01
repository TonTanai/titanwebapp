# Deploy to Azure Static Web Apps

คุณมี Azure Static Web App อยู่แล้ว มี 3 วิธีในการ deploy:

---

## วิธีที่ 1: Deploy ด้วย Azure CLI (ง่ายที่สุด)

### ขั้นตอน:

1. **ติดตั้ง Azure Static Web Apps CLI:**
```bash
npm install -g @azure/static-web-apps-cli
```

2. **Build โปรเจกต์:**
```bash
npm run build
```

3. **Deploy:**
```bash
swa deploy ./dist --env production
```

CLI จะถามข้อมูล:
- Subscription ID (เลือกจากรายการ)
- Resource Group (เลือกจากรายการ)
- Static Web App name (เลือกจากรายการ)

---

## วิธีที่ 2: Deploy ด้วย Deployment Token

### ขั้นตอน:

1. **เอา Deployment Token จาก Azure Portal:**
   - ไปที่: https://portal.azure.com
   - เปิด Static Web App ของคุณ
   - ไปที่: **Settings** → **Configuration**
   - Copy **Deployment token**

2. **รัน script:**
```bash
chmod +x deploy-swa.sh
./deploy-swa.sh
```

Script จะถาม deployment token แล้ว deploy ให้อัตโนมัติ

---

## วิธีที่ 3: Auto Deploy ผ่าน GitHub (แนะนำสำหรับระยะยาว)

### ขั้นตอน:

1. **Push โค้ดขึ้น GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/TitanWebApp.git
git push -u origin main
```

2. **เพิ่ม Secret ใน GitHub:**
   - ไปที่ GitHub repo → **Settings** → **Secrets and variables** → **Actions**
   - คลิก **New repository secret**
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: วาง Deployment Token จาก Azure Portal
   - คลิก **Add secret**

3. **GitHub Actions จะ deploy อัตโนมัติ:**
   - ไฟล์ `.github/workflows/azure-static-web-apps.yml` ถูกสร้างไว้แล้ว
   - ทุกครั้งที่ push ไป `main` branch จะ deploy อัตโนมัติ

---

## การตั้งค่าเพิ่มเติม

### 1. Custom Domain

ใน Azure Portal:
1. ไปที่ Static Web App → **Custom domains**
2. คลิก **+ Add**
3. ใส่ domain ของคุณ
4. เพิ่ม DNS records ตามที่บอก:
   ```
   Type: CNAME
   Name: www (หรือ subdomain อื่น)
   Value: <your-swa-name>.azurestaticapps.net
   ```

### 2. Environment Variables

ถ้าต้องการเพิ่ม environment variables:
1. Azure Portal → Static Web App → **Configuration**
2. คลิก **+ Add** ใน Application settings
3. ใส่ key-value

### 3. ดู Logs

Azure Portal → Static Web App → **Monitoring** → **Logs**

---

## Troubleshooting

### ปัญหา: 404 Error หลัง deploy
**แก้ไข:** ตรวจสอบว่ามีไฟล์ `staticwebapp.config.json` ✅ (มีอยู่แล้ว)

### ปัญหา: โมเดล 3D ไม่โหลด
**แก้ไข:** 
1. ตรวจสอบว่าโฟลเดอร์ `public/models/` ถูก build ไปด้วย ✅
2. ตรวจสอบ path ใน code ว่าถูกต้อง

### ปัญหา: Build ใช้เวลานาน
**แก้ไข:** 
- Vite build เร็วมาก ปกติใช้เวลาไม่เกิน 1-2 นาที
- ถ้านานเกินไปอาจเป็นเพราะโมเดล 3D ใหญ่เกินไป

---

## คำสั่งที่เป็นประโยชน์

```bash
# Build และ preview local
npm run build
npm run preview

# Deploy ด้วย SWA CLI
swa deploy

# Run local กับ SWA emulator
swa start

# ดู deployment history
az staticwebapp show --name <your-swa-name> --resource-group <your-rg>
```

---

## เปรียบเทียบวิธี Deploy

| วิธี | ความง่าย | Auto Deploy | เหมาะสำหรับ |
|------|---------|-------------|------------|
| Azure CLI | ⭐⭐⭐ | ❌ | Test ครั้งเดียว |
| Deployment Token | ⭐⭐ | ❌ | Manual deploy |
| GitHub Actions | ⭐⭐⭐⭐⭐ | ✅ | Production (แนะนำ) |

---

**แนะนำ:** ใช้ GitHub Actions (วิธีที่ 3) เพราะ:
- ✅ Deploy อัตโนมัติทุกครั้งที่ push
- ✅ Preview deployment สำหรับ PR
- ✅ Rollback ได้ง่าย
- ✅ ดู deployment history
- ✅ Free สำหรับ public repo
