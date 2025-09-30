document.addEventListener('DOMContentLoaded', () => {
    // Definisi Karakter (tidak dikirim ke API, hanya untuk referensi)
    const characters = [
        { id: "Iako", name: "Iako", desc: "Anak 4 tahun, ceria", icon: "👦" },
        { id: "Iopatua", name: "Iopatua", desc: "Kakek 60 tahun, bijak", icon: "👴" },
        { id: "Iomatua", name: "Iomatua", desc: "Nenek 50 tahun, penyayang", icon: "👵" },
        { id: "Nike", name: "Nike", desc: "Bibi 29 tahun, ramah", icon: "👩" },
        { id: "Ndege", name: "Ndege", desc: "Ayah 40 tahun, humoris", icon: "👨‍🦰" },
        { id: "Aslina", name: "Aslina", desc: "Ibu 40 tahun, lembut", icon: "👩‍🦱" }
    ];

    // Tampilkan Galeri Karakter secara Dinamis
    const characterContainer = document.querySelector('.characters');
    characters.forEach(char => {
        const charElement = document.createElement('div');
        charElement.className = 'character-card';
        charElement.innerHTML = `
            <div class="icon">${char.icon}</div>
            <h4>${char.name}</h4>
            <p>${char.desc}</p>
        `;
        characterContainer.appendChild(charElement);
    });

    const generateBtn = document.getElementById('generateBtn');
    const jsonInput = document.getElementById('jsonInput');
    const apiKeyInput = document.getElementById('apiKey');
    const apiEndpointInput = document.getElementById('apiEndpoint');
    const resultArea = document.getElementById('resultArea');
    const loadingSpinner = document.getElementById('loading');
    const videoResult = document.getElementById('videoResult');
    const downloadBtn = document.getElementById('downloadBtn');

    // Contoh JSON untuk placeholder
    jsonInput.value = JSON.stringify(
        {
          "title": "Rahasia Hutan Desa Rimbun",
          "scenes": [
            {
              "prompt": "Pagi hari di desa pegunungan Indonesia yang asri, kabut tipis masih menyelimuti. Wide shot menyorot desa lalu zoom ke rumah kayu sederhana. Seorang anak laki-laki bernama Iako berlari keluar.",
              "duration_seconds": 10
            },
            {
              "prompt": "Di halaman rumah, seorang kakek tua (Iopatua) sedang duduk di kursi bambu. Iako mendekatinya. Iopatua tersenyum bijaksana. Medium shot.",
              "duration_seconds": 8
            }
          ]
        }, null, 2
    );

    generateBtn.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        const apiEndpoint = apiEndpointInput.value.trim();
        let promptData;

        // 1. Validasi Input
        if (!apiKey || !apiEndpoint) {
            alert("Harap masukkan URL Endpoint API dan API Key Anda.");
            return;
        }
        try {
            promptData = JSON.parse(jsonInput.value);
        } catch (error) {
            alert("Format JSON tidak valid. Harap periksa kembali.");
            return;
        }

        // 2. Tampilkan Loading
        resultArea.style.display = 'block';
        videoResult.style.display = 'none';
        loadingSpinner.style.display = 'block';
        downloadBtn.style.display = 'none';

        // 3. Siapkan data untuk dikirim ke API RunwayML
        // Menggabungkan semua prompt scene menjadi satu teks panjang
        const fullPrompt = promptData.scenes.map(scene => scene.prompt).join(" ");
        
        const requestBody = {
            "text_prompt": fullPrompt,
            "motion": 2.5, // nilai default untuk pergerakan
            "seed": Math.floor(Math.random() * 1000000) // seed acak untuk hasil berbeda
        };
        
        try {
            // 4. Kirim Permintaan ke API
            const response = await fetch(apiEndpoint + '/generate', { // Pastikan endpoint diakhiri dengan /generate
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error (${response.status}): ${errorData.message || 'Gagal memulai video generation'}`);
            }

            const result = await response.json();
            const taskId = result.uuid;

            // 5. Cek status video secara berkala
            checkTaskStatus(taskId, apiKey, apiEndpoint);

        } catch (error) {
            loadingSpinner.style.display = 'none';
            alert(`Terjadi kesalahan saat memulai: ${error.message}`);
            console.error(error);
        }
    });

    async function checkTaskStatus(taskId, apiKey, apiEndpoint) {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${apiEndpoint}/tasks/${taskId}`, {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                
                if (!response.ok) {
                    clearInterval(interval);
                    throw new Error('Gagal memeriksa status task.');
                }

                const result = await response.json();

                if (result.status === "succeeded") {
                    clearInterval(interval);
                    // 6. Tampilkan Hasil
                    const videoUrl = result.output.video_path;
                    videoResult.src = videoUrl;
                    downloadBtn.href = videoUrl;
                    
                    loadingSpinner.style.display = 'none';
                    videoResult.style.display = 'block';
                    downloadBtn.style.display = 'inline-block';
                } else if (result.status === "failed") {
                    clearInterval(interval);
                    loadingSpinner.style.display = 'none';
                    alert('Maaf, AI gagal membuat video.');
                }
                // Jika masih "processing", biarkan interval berjalan
            } catch (error) {
                clearInterval(interval);
                loadingSpinner.style.display = 'none';
                alert(`Terjadi kesalahan saat memeriksa status: ${error.message}`);
                console.error(error);
            }
        }, 5000); // Cek setiap 5 detik
    }
});          "episode": "1",
          "title": "Rahasia Hutan Desa Rimbun",
          "scenes": [
            {
              "scene": "1",
              "setting": "Pagi hari di desa pegunungan, kabut tipis masih menyelimuti.",
              "camera": "wide shot menyorot desa lalu zoom ke rumah keluarga Iako.",
              "characters": ["Iako", "Aslina"],
              "dialogue": [
                {"character": "Iako", "line": "Ibu, aku mau main ke kebun, boleh ya?"},
                {"character": "Aslina", "line": "Boleh, tapi jangan jauh-jauh, Nak."}
              ],
              "music": "suara burung, musik pedesaan ceria."
            }
          ]
        }, null, 2
    );

    generateBtn.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        const apiEndpoint = apiEndpointInput.value.trim();
        let promptData;

        // 1. Validasi Input
        if (!apiKey || !apiEndpoint) {
            alert("Harap masukkan URL Endpoint API dan API Key Anda.");
            return;
        }
        try {
            promptData = JSON.parse(jsonInput.value);
        } catch (error) {
            alert("Format JSON tidak valid. Harap periksa kembali.");
            return;
        }

        // 2. Tampilkan Loading & Sembunyikan Video Lama
        resultArea.style.display = 'block';
        videoResult.style.display = 'none';
        loadingSpinner.style.display = 'block';
        downloadBtn.style.display = 'none';

        // 3. Siapkan data untuk dikirim ke API
        const requestBody = {
            ...promptData,
            output_format: "mp4",
            duration_minutes: 3,
            animation_style: "3d_cartoon_film",
            character_definitions: characters, // Mengirim definisi karakter ke API
            background: "Desa kecil di tengah pegunungan dengan hutan rimba yang sangat asri."
        };

        try {
            // 4. Kirim Permintaan ke API (Ini adalah bagian simulasi)
            // GANTI BAGIAN INI dengan logika fetch API yang sesungguhnya
            console.log("Mengirim data ke API:", apiEndpoint);
            console.log("Body:", JSON.stringify(requestBody));

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}` // Standar umum otentikasi
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error (${response.status}): ${errorData.message || 'Gagal menghasilkan video'}`);
            }

            const result = await response.json();
            
            // Misalkan API mengembalikan URL video dalam format blob atau URL langsung
            const videoUrl = result.videoUrl; // Sesuaikan dengan respons API Anda

            // 5. Tampilkan Hasil
            videoResult.src = videoUrl;
            downloadBtn.href = videoUrl;
            
            loadingSpinner.style.display = 'none';
            videoResult.style.display = 'block';
            downloadBtn.style.display = 'inline-block';

        } catch (error) {
            loadingSpinner.style.display = 'none';
            alert(`Terjadi kesalahan: ${error.message}`);
            console.error(error);
        }
    });
});
