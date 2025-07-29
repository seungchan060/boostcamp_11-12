const socket = io.connect('wss://seungchan.kr:1122');
const queueEl = document.getElementById('queue');
const transcodingEl = document.getElementById('transcoding');
const verifyingEl = document.getElementById('verifying');
const logEl = document.getElementById('log');

const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', async () => {
    const input = document.getElementById('uploadInput').value.trim();
    if (!input) return;
    await fetch('/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos: input.split(',') }),
    });
});

function render(videos) {
    queueEl.innerHTML = '';
    transcodingEl.innerHTML = '';
    verifyingEl.innerHTML = '';
    logEl.innerHTML = '';

    videos.forEach((v) => {
        const el = document.createElement('div');
        el.className = 'card';
        el.innerHTML = `<span>A</span> ID: ${v.id}${v.type ? `<div class="tag">${v.type}</div>` : ''}`;

        switch (v.status) {
            case '대기중':
            case '변환대기':
                queueEl.appendChild(el);
                break;
            case '변환중': {
                const active = document.createElement('div');
                active.className = 'card active';
                active.innerHTML = `<span>A</span> ID: ${v.id}<div class="tag">Transcoding</div>`;
                transcodingEl.appendChild(active);
                break;
            }
            case '검증중': {
                const verify = document.createElement('div');
                verify.className = 'card';
                verify.innerHTML = `<span>A</span> ID: ${v.id}<div class="tag gray">Verifying</div>`;
                verifyingEl.appendChild(verify);
                break;
            }
            case '공개중': {
                const msg = `ID: ${v.id} ${v.type} transcoded`;
                logEl.innerHTML += msg + '\n';
                break;
            }
        }
    });
}

socket.on('update', ({ videos }) => {
    render(videos);
});
