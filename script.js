const canvas = document.querySelector('#starCanvas');
const context = canvas ? canvas.getContext('2d') : null;
const revealItems = document.querySelectorAll('.reveal');

let petals = [];

function createStorage() {
    const memoryStore = new Map();

    try {
        const testKey = '__blog_storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return localStorage;
    } catch (error) {
        return {
            getItem(key) {
                return memoryStore.has(key) ? memoryStore.get(key) : null;
            },
            setItem(key, value) {
                memoryStore.set(key, String(value));
            },
            removeItem(key) {
                memoryStore.delete(key);
            }
        };
    }
}

const storage = createStorage();

function resizeCanvas() {
    if (!canvas) {
        return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    petals = Array.from({ length: Math.min(64, Math.floor(window.innerWidth / 18)) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2 + Math.random() * 4,
        speed: 0.35 + Math.random() * 0.85,
        drift: -0.35 + Math.random() * 0.7,
        alpha: 0.18 + Math.random() * 0.34,
        angle: Math.random() * Math.PI
    }));
}

function drawPetals() {
    if (!canvas || !context) {
        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach((petal) => {
        petal.angle += 0.01;
        context.save();
        context.translate(petal.x, petal.y);
        context.rotate(petal.angle);
        context.fillStyle = `rgba(251, 114, 153, ${petal.alpha})`;
        context.beginPath();
        context.ellipse(0, 0, petal.radius * 0.72, petal.radius * 1.65, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();

        petal.x += petal.drift;
        petal.y += petal.speed;
        if (petal.y > canvas.height + 20 || petal.x < -20 || petal.x > canvas.width + 20) {
            petal.x = Math.random() * canvas.width;
            petal.y = -20;
        }
    });
    requestAnimationFrame(drawPetals);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.16 });

revealItems.forEach((item) => observer.observe(item));

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderComments(list, comments) {
    if (!list) {
        return;
    }

    if (comments.length === 0) {
        list.innerHTML = '<p>暂无评论，留下第一条评论吧。</p>';
        return;
    }

    list.innerHTML = comments.map((comment) => `
        <article class="comment-item">
            <p>${escapeHtml(comment.text)}</p>
            <time>${escapeHtml(comment.createdAt)}</time>
        </article>
    `).join('');
}

function setLikeButtonText(button, liked) {
    const label = liked ? '♥ 已赞 ' : '♡ 点赞 ';
    const textNode = Array.from(button.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);

    if (textNode) {
        textNode.textContent = label;
        return;
    }

    button.insertBefore(document.createTextNode(label), button.firstChild);
}

function setupBlogInteractions() {
    const blogId = document.body.dataset.blogId;
    if (!blogId) {
        return;
    }

    const likeButton = document.querySelector('[data-like-button]');
    const likeCount = document.querySelector('[data-like-count]');
    const commentForm = document.querySelector('[data-comment-form]');
    const commentList = document.querySelector('[data-comment-list]');
    const likeKey = `star-diary-like-${blogId}`;
    const likedKey = `diary-liked-${blogId}`;
    const commentsKey = `diary-comments-${blogId}`;

    const getComments = () => {
        try {
            const comments = JSON.parse(storage.getItem(commentsKey) || '[]');
            return Array.isArray(comments) ? comments : [];
        } catch (error) {
            return [];
        }
    };
    const updateLikeView = () => {
        const count = Number(storage.getItem(likeKey) || '0');
        const liked = storage.getItem(likedKey) === 'true';
        if (likeCount) {
            likeCount.textContent = String(count);
        }
        if (likeButton) {
            likeButton.classList.toggle('liked', liked);
            setLikeButtonText(likeButton, liked);
        }
    };

    updateLikeView();
    renderComments(commentList, getComments());

    if (likeButton) {
        likeButton.addEventListener('click', () => {
            const liked = storage.getItem(likedKey) === 'true';
            const count = Number(storage.getItem(likeKey) || '0');
            storage.setItem(likedKey, String(!liked));
            storage.setItem(likeKey, String(Math.max(0, count + (liked ? -1 : 1))));
            updateLikeView();
        });
    }

    if (commentForm) {
        commentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(commentForm);
            const text = String(formData.get('comment') || '').trim();
            if (!text) {
                return;
            }

            const comments = getComments();
            comments.unshift({
                text,
                createdAt: new Date().toLocaleString('zh-CN', { hour12: false })
            });
            storage.setItem(commentsKey, JSON.stringify(comments.slice(0, 12)));
            commentForm.reset();
            renderComments(commentList, getComments());
        });
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawPetals();
setupBlogInteractions();
