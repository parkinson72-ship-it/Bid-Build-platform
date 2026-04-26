// bid-build-platform/lib/virusTotal.ts

import axios from "axios";

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY!;
const VIRUSTOTAL_URL = "https://www.virustotal.com/api/v3/files";

// Upload a file buffer to VirusTotal for scanning
export async function scanFileWithVirusTotal(fileBuffer: Buffer) {
  const formData = new FormData();
  formData.append("file", new Blob([fileBuffer]), "upload.bin");

  const response = await axios.post(VIRUSTOTAL_URL, formData, {
    headers: {
      "x-apikey": VIRUSTOTAL_API_KEY,
    },
  });

  return response.data;
}

// Get scan result by ID
export async function getVirusTotalResult(scanId: string) {
  const response = await axios.get(
    `https://www.virustotal.com/api/v3/analyses/${scanId}`,
    {
      headers: {
        "x-apikey": VIRUSTOTAL_API_KEY,
      },
    }
  );

  return response.data;
}

