document.addEventListener('DOMContentLoaded', () => {
    // Definisi Karakter dan Voice Mappings
    const characters = [
        { id: "Iako", name: "Iako", desc: "Anak 4 tahun, ceria", icon: "👦", voice: "child_male_indonesian" },
        { id: "Iopatua", name: "Iopatua", desc: "Kakek 60 tahun, bijak", icon: "👴", voice: "elderly_male_indonesian" },
        { id: "Iomatua", name: "Iomatua", desc: "Nenek 50 tahun, penyayang", icon: "👵", voice: "elderly_female_indonesian" },
        { id: "Nike", name: "Nike", desc: "Bibi 29 tahun, ramah", icon: "👩", voice: "adult_female_indonesian_friendly" },
        { id: "Ndege", name: "Ndege", desc: "Ayah 40 tahun, humoris", icon: "👨‍🦰", voice: "adult_male_indonesian_wise" },
        { id: "Aslina", name: "Aslina", desc: "Ibu 40 tahun, lembut", icon: "👩‍🦱", voice: "adult_female_indonesian_low" }
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
          "episode": "1",
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