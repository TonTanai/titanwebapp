# Deploy to Azure - คู่มือการใช้งาน

## ขั้นตอนการ Deploy

### 1. ติดตั้ง Azure CLI

```bash
# macOS
brew install azure-cli

# ตรวจสอบการติดตั้ง
az --version
```

### 2. ตั้งค่าไฟล์ deploy-azure.sh

เปิดไฟล์ `deploy-azure.sh` แก้ไขค่าเหล่านี้:

```bash
RESOURCE_GROUP="anatomy-viewer-rg"        # ชื่อ Resource Group
STORAGE_ACCOUNT="anatomyviewer123"         # ชื่อ Storage Account (ต้องไม่ซ้ำกับคนอื่นใน Azure)
LOCATION="southeastasia"                   # Region (southeastasia = Singapore)
```

**หมายเหตุ:** `STORAGE_ACCOUNT` ต้องเป็น:
- ตัวเล็กอย่างเดียว (lowercase)
- ความยาว 3-24 ตัวอักษร
- ไม่มีอักขระพิเศษ (ห้าม `-` หรือ `_`)
- ไม่ซ้ำกับคนอื่นใน Azure ทั่วโลก

### 3. ให้สิทธิ์ Run Script

```bash
chmod +x deploy-azure.sh
```

### 4. Deploy!

```bash
./deploy-azure.sh
```

Script จะทำดังนี้:
1. ✅ Build โปรเจกต์ (npm run build)
2. ✅ Login เข้า Azure
3. ✅ สร้าง Resource Group
4. ✅ สร้าง Storage Account
5. ✅ เปิดใช้งาน Static Website
6. ✅ Upload ไฟล์ทั้งหมด
7. ✅ แสดง URL ของเว็บไซต์

---

## วิธีอื่นๆ

### วิธีที่ 1: Deploy ผ่าน Azure Portal (Manual)

1. Build โปรเจกต์:
   ```bash
   npm run build
   ```

2. เข้า [Azure Portal](https://portal.azure.com)

3. สร้าง Storage Account:
   - เลือก "Storage accounts" → "Create"
   - ตั้งค่า Static website hosting
   - Upload ไฟล์จากโฟลเดอร์ `dist/`

### วิธีที่ 2: ใช้ VS Code Extension

1. ติดตั้ง Extension: "Azure Storage"
2. Login เข้า Azure
3. Right-click โฟลเดอร์ `dist/` → "Deploy to Static Website"

---

## ค่าใช้จ่าย

**Azure Storage Static Website:**
- Free tier: 5 GB storage, 50 GB bandwidth/month
- หลังจากนั้น: ~฿0.60/GB storage, ~฿2.50/GB bandwidth

**Azure Static Web Apps (ทางเลือก):**
- Free tier: 100 GB bandwidth/month
- SSL Certificate ฟรี
- Custom domain ฟรี

---

## การตั้งค่า Custom Domain

1. ไปที่ Storage Account → Networking → Custom domain
2. เพิ่ม CNAME record ที่ DNS provider ของคุณ:
   ```
   CNAME: www.yourdomain.com → yourappname123.z23.web.core.windows.net
   ```
3. Verify domain ใน Azure Portal

---

## Troubleshooting

### ปัญหา: Storage account name ซ้ำ
```bash
# ลองใช้ชื่ออื่น เช่น:
STORAGE_ACCOUNT="anatomyviewer2024"
```

### ปัญหา: 404 Error เมื่อเข้าหน้าอื่น
- ตรวจสอบว่ามีไฟล์ `staticwebapp.config.json` ✅
- ตรวจสอบการตั้งค่า 404 document เป็น `index.html` ✅

### ปัญหา: CORS Error
- เพิ่ม CORS settings ใน Storage Account:
  ```bash
  az storage cors add \
    --account-name $STORAGE_ACCOUNT \
    --services b \
    --methods GET \
    --origins "*" \
    --allowed-headers "*"
  ```

### ปัญหา: โมเดล 3D ไม่แสดง
- ตรวจสอบว่าไฟล์ `.glb` ถูก upload ✅
- ตรวจสอบ MIME type ใน `staticwebapp.config.json` ✅

---

## เพิ่มประสิทธิภาพ

### 1. เพิ่ม CDN (แนะนำ)
```bash
# สร้าง CDN Profile และ Endpoint
az cdn profile create \
  --name anatomy-viewer-cdn \
  --resource-group $RESOURCE_GROUP \
  --sku Standard_Microsoft

az cdn endpoint create \
  --name anatomyviewer \
  --profile-name anatomy-viewer-cdn \
  --resource-group $RESOURCE_GROUP \
  --origin yourappname123.z23.web.core.windows.net
```

### 2. เปิดใช้งาน HTTPS (มีให้อัตโนมัติ)
- Azure Storage Static Website รองรับ HTTPS โดยอัตโนมัติ

---

## คำสั่งที่เป็นประโยชน์

```bash
# ดู website URL
az storage account show \
  --name $STORAGE_ACCOUNT \
  --query "primaryEndpoints.web" \
  --output tsv

# ลบไฟล์ทั้งหมด
az storage blob delete-batch \
  --account-name $STORAGE_ACCOUNT \
  --source '$web'

# ดู logs
az storage logging show \
  --account-name $STORAGE_ACCOUNT \
  --services b

# ลบทุกอย่าง
az group delete --name $RESOURCE_GROUP --yes
```
