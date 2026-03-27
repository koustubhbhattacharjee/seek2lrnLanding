        function toggleMenu() {
            const nav = document.getElementById('nav-links');
            const btn = document.getElementById('menu-toggle');
            nav.classList.toggle('open');
            btn.classList.toggle('open');
        }
        function closeMenu() {
            document.getElementById('nav-links').classList.remove('open');
            document.getElementById('menu-toggle').classList.remove('open');
        }

        // glisten animation for globe hint
        (function(){
            const style = document.createElement('style');
            style.textContent = '@keyframes glisten{0%,100%{text-shadow:0 0 10px rgba(232,98,42,0.4),0 0 24px rgba(232,98,42,0.2)}40%{text-shadow:0 0 20px rgba(232,98,42,0.9),0 0 40px rgba(255,160,80,0.5),0 0 60px rgba(232,98,42,0.3)}}.glisten{animation:glisten 1.6s ease-in-out infinite;}';
            document.head.appendChild(style);
            document.getElementById('hero-type-text').textContent = "Seek2lrn is a decentralized, open-access marketplace that enables direct, borderless interaction between educators and learners.";
            document.getElementById('get-started-cta').style.opacity = '1';
        })();

        const _atlasTeacher = `
            <div style="font-family:'IM Fell English',serif;font-weight:700;font-size:15px;margin-bottom:6px;line-height:1.3;color:#F0E6DC;">Your Students</div>
            <div style="font-family:'Courier Prime',monospace;font-style:italic;font-size:11px;margin-bottom:10px;color:rgba(240,230,220,0.6);">learn from anywhere</div>
            Reach students from every corner of the world. They choose you, your method, your pace. No middlemen.<br><br>
            Your teaching shapes their path. Every interaction leaves a mark.
            <div style="margin-top:16px;">
                <button onclick="showPage('tutors')" style="background:#E8622A;color:#1E1208;border:none;font-family:'Courier Prime',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:10px 18px;cursor:pointer;width:100%;">Meet your students →</button>
            </div>`;
        const _atlasStudent = `
            <div style="font-family:'IM Fell English',serif;font-weight:700;font-size:15px;margin-bottom:6px;line-height:1.3;">Your Teachers</div>
            <div style="font-family:'Courier Prime',monospace;font-style:italic;font-size:11px;margin-bottom:10px;color:rgba(26,18,8,0.65);">decentralized &amp; borderless</div>
            Use our platform with your teachers or search from our incredible pool of teachers, from all around the world, native to the platform.<br><br>
            Interactions with teachers guide your brushstrokes while you paint your own learning path.
            <div style="margin-top:16px;">
                <button onclick="showPage('tutors')" style="background:#1E1208;color:#E8622A;border:none;font-family:'Courier Prime',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:10px 18px;cursor:pointer;width:100%;">Find a tutor →</button>
            </div>`;
        const _spiroTeacher = `
            <div style="font-family:'IM Fell English',serif;font-weight:700;font-size:15px;margin-bottom:10px;line-height:1.3;color:#1E1208;">Your Teaching</div>
            <div style="font-style:italic;margin-bottom:10px;color:rgba(30,18,8,0.65);">Structure meets flow.</div>
            Your teaching is as unique as your students, shaped by your methods, your subjects, and the learners you bring along. Each session leaves its own signature.<br><br>
            We handle the infrastructure: scheduling, payments, progress tracking. All simple, easy to manage. You focus on teaching.
            <div style="margin-top:16px;">
                <a onclick="showPage('register');setTimeout(()=>showRegForm('tutor'),100);" style="display:block;background:#1E1208;color:#F0E6DC;font-family:'Courier Prime',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:10px 18px;cursor:pointer;text-align:center;text-decoration:none;">Register as a teacher →</a>
            </div>`;
        const _spiroStudent = `
            <div style="font-family:'IM Fell English',serif;font-weight:700;font-size:15px;margin-bottom:10px;line-height:1.3;color:#F0E6DC;">Your Learning</div>
            <div style="font-style:italic;margin-bottom:10px;color:rgba(240,230,220,0.75);">Tech meets Art.</div>
            Your learning is specific to your choices, your own learning styles, personality and the teachers you'd like to bring along in this journey. The process leaves a signature, like an artwork.<br><br>
            We handle the infrastructure: teachers, subjects and learning data, all simple to use, easy to analyze and save. You'd have all the best tools to make this artwork your own.
            <div style="margin-top:16px;">
                <a onclick="showPage('register');setTimeout(()=>showRegForm('student'),100);" style="display:block;background:#E8622A;color:#1E1208;font-family:'Courier Prime',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:10px 18px;cursor:pointer;text-align:center;text-decoration:none;">Register as a student →</a>
            </div>`;

        function _applyCardStyles(teacher) {
            const ac = document.getElementById('atlas-card');
            const sc = document.getElementById('spiro-card');
            if (teacher) {
                ac.style.background = '#1E1208'; ac.style.color = '#F0E6DC';
                ac.innerHTML = _atlasTeacher;
                sc.style.background = '#F0E6DC'; sc.style.color = '#1E1208';
                sc.innerHTML = _spiroTeacher;
            } else {
                ac.style.background = '#E8622A'; ac.style.color = '#1E1208';
                ac.innerHTML = _atlasStudent;
                sc.style.background = '#1E1208'; sc.style.color = '#F0E6DC';
                sc.innerHTML = _spiroStudent;
            }
            const UI_IDS = ['atlas-label','spiro-label','name-row','slider-row','pen-desc','globe-hint','globe-stop','spiro-pause','spiro-clear'];
            if (teacher) {
                UI_IDS.forEach(id => {
                    const el = document.getElementById(id);
                    if (!el) return;
                    el.style.color = id === 'globe-hint' ? '#F0E6DC' : 'rgba(30,18,8,0.75)';
                    if (el.tagName === 'BUTTON') el.style.borderColor = 'rgba(30,18,8,0.25)';
                });
                document.getElementById('globe-hint').style.opacity = '1';
                document.getElementById('globe-hint').textContent = 'Every student is a shape (◻ △ ○). Click on any shape to see their work on the right.';
                document.getElementById('spiro-label').textContent = 'instruction graph';
                const nameSpan = document.querySelector('#name-row span');
                if (nameSpan) nameSpan.textContent = 'student name:';
            } else {
                UI_IDS.forEach(id => {
                    const el = document.getElementById(id);
                    if (!el) return;
                    el.style.color = '';
                    if (el.tagName === 'BUTTON') el.style.borderColor = '';
                });
                document.getElementById('globe-hint').style.opacity = '0.5';
                document.getElementById('globe-hint').textContent = 'Every teacher is a shape (◻ △ ○). Click on any shape to see their work on the right.';
                document.getElementById('spiro-label').textContent = 'knowledge spirograph';
                const nameSpan = document.querySelector('#name-row span');
                if (nameSpan) nameSpan.textContent = 'tutor name:';
            }
        }

        function showStudentView() {
            if (typeof setTeacherMode === 'function') setTeacherMode(false);
            const vsb = document.getElementById('view-switch-btn');
            if (vsb) { vsb.style.display = 'block'; vsb.dataset.mode = 'student'; vsb.textContent = 'switch to teacher'; vsb.style.background = '#E8622A'; vsb.style.color = '#1E1208'; }
            const hero = document.querySelector('.hero');
            hero.style.transition = 'opacity 0.15s ease';
            hero.style.opacity = '0';
            setTimeout(() => {
                const heroVisuals = document.getElementById('hero-visuals');
                const interactSection = document.getElementById('interact');
                const scrollCue = document.getElementById('scroll-cue');
                hero.style.background = 'var(--cream)';
                hero.style.borderBottom = '1px solid var(--dim)';
                hero.style.justifyContent = 'flex-start';
                document.querySelector('.hero > div').style.color = 'var(--brown)';
                document.getElementById('hero-type-text').style.color = 'var(--mid)';
                document.getElementById('tag-line1').style.color = 'var(--brown)';
                document.getElementById('tag-line2').style.color = 'var(--rust)';
                document.getElementById('get-started-cta').style.display = 'none';
                _applyCardStyles(false);
                heroVisuals.classList.remove('spiro-revealed');
                document.getElementById('atlas-card').style.opacity = window.innerWidth <= 768 ? '1' : '0';
                if (typeof selectedLabel !== 'undefined') selectedLabel = '';
                if (typeof hoveredLabel !== 'undefined') hoveredLabel = '';
                if (typeof globePaused !== 'undefined') globePaused = false;
                const globeButton = document.getElementById('globe-stop');
                if (globeButton) globeButton.textContent = 'stop rotation';
                heroVisuals.style.display = 'flex';
                if (interactSection) { interactSection.style.display = 'flex'; interactSection.classList.remove('teacher-mode'); }
                if (scrollCue) {
                    scrollCue.classList.remove('is-hidden');
                    scrollCue.style.display = 'flex';
                }
                hero.style.opacity = '1';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 150);
        }

        function showTeacherView() {
            if (typeof setTeacherMode === 'function') setTeacherMode(true);
            const vsb = document.getElementById('view-switch-btn');
            if (vsb) { vsb.style.display = 'block'; vsb.dataset.mode = 'teacher'; vsb.textContent = 'switch to student'; vsb.style.background = '#F0E6DC'; vsb.style.color = '#1E1208'; }
            const hero = document.querySelector('.hero');
            hero.style.transition = 'opacity 0.15s ease';
            hero.style.opacity = '0';
            setTimeout(() => {
                const heroVisuals = document.getElementById('hero-visuals');
                const interactSection = document.getElementById('interact');
                const scrollCue = document.getElementById('scroll-cue');
                hero.style.background = 'var(--accent)';
                hero.style.borderBottom = '1px solid rgba(30,18,8,0.15)';
                hero.style.justifyContent = 'flex-start';
                document.querySelector('.hero > div').style.color = 'var(--brown)';
                document.getElementById('hero-type-text').style.color = 'rgba(30,18,8,0.75)';
                document.getElementById('tag-line1').style.color = 'var(--brown)';
                document.getElementById('tag-line2').style.color = 'var(--parchment)';
                document.getElementById('get-started-cta').style.display = 'none';
                _applyCardStyles(true);
                heroVisuals.classList.remove('spiro-revealed');
                document.getElementById('atlas-card').style.opacity = '0';
                if (typeof selectedLabel !== 'undefined') selectedLabel = '';
                if (typeof hoveredLabel !== 'undefined') hoveredLabel = '';
                if (typeof globePaused !== 'undefined') globePaused = false;
                const globeButton = document.getElementById('globe-stop');
                if (globeButton) globeButton.textContent = 'stop rotation';
                heroVisuals.style.display = 'flex';
                if (interactSection) { interactSection.style.display = 'flex'; interactSection.classList.add('teacher-mode'); }
                if (scrollCue) {
                    scrollCue.classList.remove('is-hidden');
                    scrollCue.style.display = 'flex';
                }
                hero.style.opacity = '1';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 150);
        }

        function showPage(id) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById('page-' + id).classList.add('active');
            if (id === 'home') {
                const hero = document.querySelector('.hero');
                const heroVisuals = document.getElementById('hero-visuals');
                const interactSection = document.getElementById('interact');
                const scrollCue = document.getElementById('scroll-cue');
                const getStarted = document.getElementById('get-started-cta');
                const teacherPlaceholder = document.getElementById('teacher-placeholder');
                const heroTypeText = document.getElementById('hero-type-text');
                if (heroVisuals) heroVisuals.classList.remove('spiro-revealed');
                if (heroVisuals) heroVisuals.style.display = 'none';
                if (interactSection) { interactSection.style.display = 'none'; interactSection.classList.remove('teacher-mode'); }
                if (scrollCue) {
                    scrollCue.classList.remove('is-hidden');
                    scrollCue.style.display = 'none';
                }
                if (typeof selectedLabel !== 'undefined') selectedLabel = '';
                if (typeof hoveredLabel !== 'undefined') hoveredLabel = '';
                if (getStarted) getStarted.style.display = 'flex';
                if (teacherPlaceholder) teacherPlaceholder.style.display = 'none';
                if (hero) {
                    hero.style.background = 'var(--brown)';
                    hero.style.borderBottom = '1px solid rgba(240,230,220,0.08)';
                    hero.style.justifyContent = 'center';
                    hero.style.opacity = '1';
                }
                document.querySelector('.hero > div').style.color = 'var(--parchment)';
                document.getElementById('tag-line1').style.color = 'var(--parchment)';
                document.getElementById('tag-line2').style.color = 'var(--accent)';
                if (typeof setTeacherMode === 'function') setTeacherMode(false);
                _applyCardStyles(false);
                const atlasCard = document.getElementById('atlas-card');
                if (atlasCard) atlasCard.style.opacity = '0';
                if (heroTypeText) heroTypeText.style.color = 'rgba(240,230,220,0.88)';
                const vsb = document.getElementById('view-switch-btn');
                if (vsb) vsb.style.display = 'none';
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Reset register to choice screen when navigating to it
            if (id === 'register') backToChoice();
        }

        function updateScrollCueVisibility() {
            const scrollCue = document.getElementById('scroll-cue');
            const interactSection = document.getElementById('interact');
            if (!scrollCue || scrollCue.style.display === 'none' || !interactSection || interactSection.style.display === 'none') return;
            const rect = interactSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.85) scrollCue.classList.add('is-hidden');
            else scrollCue.classList.remove('is-hidden');
        }

        function showRegForm(role) {
            document.getElementById('reg-choice').style.display = 'none';
            const screen = document.getElementById('reg-form-screen');
            screen.classList.add('visible');
            // Show only the chosen side, but keep the other as a blank filler
            const student = document.getElementById('form-student');
            const tutor = document.getElementById('form-tutor');
            if (role === 'student') {
                student.style.display = 'flex';
                tutor.style.display = 'flex';
                tutor.style.opacity = '0.3';
                tutor.style.pointerEvents = 'none';
            } else {
                tutor.style.display = 'flex';
                student.style.display = 'flex';
                student.style.opacity = '0.3';
                student.style.pointerEvents = 'none';
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function backToChoice() {
            document.getElementById('reg-choice').style.display = 'grid';
            const screen = document.getElementById('reg-form-screen');
            screen.classList.remove('visible');
            const student = document.getElementById('form-student');
            const tutor = document.getElementById('form-tutor');
            student.style.display = 'none';
            student.style.opacity = '1';
            student.style.pointerEvents = 'auto';
            tutor.style.display = 'none';
            tutor.style.opacity = '1';
            tutor.style.pointerEvents = 'auto';
        }

        const items = document.querySelectorAll('.m-item');
        const wraps = document.querySelectorAll('.content-wrap');
        let current = 0, isMoving = false;

        function triggerLearnAnim() {
            const el = document.getElementById('v-learn');
            el.classList.remove('playing');
            void el.offsetWidth;
            el.classList.add('playing');
        }

        function updateUI(index) {
            items.forEach(i => i.classList.remove('active'));
            wraps.forEach(w => w.classList.remove('active'));
            items[index].classList.add('active');
            wraps[index].classList.add('active');
            current = index;
            if (wraps[index].id === 'v-learn') { triggerLearnAnim(); }
            else if (wraps[index].id === 'v-teach') { stopRubik(); setTimeout(initRubik, 80); }
            else stopRubik();
        }

        const interactObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) updateScrollCueVisibility();
                if (entry.isIntersecting && current === 0) triggerLearnAnim();
            });
        }, { threshold: 0.5 });
        const interactSection = document.getElementById('interact');
        if (interactSection) interactObs.observe(interactSection);
        window.addEventListener('scroll', updateScrollCueVisibility, { passive: true });

        window.addEventListener('wheel', (e) => {
            if (!document.getElementById('page-home').classList.contains('active')) return;
            const section = document.getElementById('interact');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                if (current === 3 && e.deltaY > 0) return;
                if (current === 0 && e.deltaY < 0) return;
                e.preventDefault();
                if (isMoving) return;
                isMoving = true;
                if (e.deltaY > 0) current++; else current--;
                updateUI(current);
                setTimeout(() => { isMoving = false; }, 400);
            }
        }, { passive: false });

        items.forEach((item, i) => item.addEventListener('click', () => updateUI(i)));

        // ── Touch swipe for interactive section ──────────────────────────
        (function() {
            const section = document.getElementById('interact');
            let txStart = 0, tyStart = 0;
            section.addEventListener('touchstart', e => {
                txStart = e.touches[0].clientX;
                tyStart = e.touches[0].clientY;
            }, { passive: true });
            section.addEventListener('touchend', e => {
                const dx = e.changedTouches[0].clientX - txStart;
                const dy = e.changedTouches[0].clientY - tyStart;
                if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return; // not a horizontal swipe
                if (isMoving) return;
                isMoving = true;
                if (dx < 0 && current < 3) current++;   // swipe left → next
                else if (dx > 0 && current > 0) current--; // swipe right → prev
                updateUI(current);
                setTimeout(() => { isMoving = false; }, 400);
            }, { passive: true });
        })();

        function replaySection(id) {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === 'v-learn') { triggerLearnAnim(); return; }
            el.classList.remove('active');
            void el.offsetWidth;
            el.classList.add('active');
            if (id === 'v-teach') { stopRubik(); setTimeout(initRubik, 80); }
        }

        // ── Rubik engine ─────────────────────────────────────────────────
        const OR='#E8622A', RU='#C44A1A', WH='#F7F0EA';
        const FACE_CFG = {
            ct:{cell:40,init:[OR,RU,RU,OR]}, tl:{cell:28,init:[OR,RU,RU,OR]},
            tr:{cell:28,init:[RU,OR,OR,RU]}, bl:{cell:28,init:[RU,OR,OR,RU]},
            br:{cell:28,init:[OR,RU,RU,OR]},
        };
        const RALL=['ct','tl','tr','bl','br'], ROUTER=['tl','tr','bl','br'];
        let rState={}, rStrips={}, rTimers=[];
        function rw(ms,cb){rTimers.push(setTimeout(cb,ms));}
        function stopRubik(){rTimers.forEach(clearTimeout);rTimers=[];}

        function buildFace(id) {
            const cfg = FACE_CFG[id];
            const root = document.getElementById('rubik-root');
            let el = root.querySelector('.face.'+id);
            if (el) el.remove();
            el = document.createElement('div');
            el.className = 'face '+id;
            root.appendChild(el);
            rState[id] = [...cfg.init];
            rStrips[id] = [[],[]];
            for (let row=0; row<2; row++) {
                for (let col=0; col<2; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.style.width = cfg.cell+'px';
                    cell.style.height = cfg.cell+'px';
                    const strip = document.createElement('div');
                    strip.className = 'strip';
                    strip.style.width = (cfg.cell*3)+'px';
                    strip.style.transform = 'translateX(-'+cfg.cell+'px)';
                    const idx = row*2+col;
                    const blocks = [];
                    for (let b=0; b<3; b++) {
                        const block = document.createElement('div');
                        block.className = 'block';
                        block.style.width = cfg.cell+'px';
                        block.style.background = b===1 ? rState[id][idx] : WH;
                        strip.appendChild(block);
                        blocks.push(block);
                    }
                    cell.appendChild(strip);
                    el.appendChild(cell);
                    rStrips[id][row][col] = {el:strip, blocks};
                }
            }
        }

        function buildAll() { RALL.forEach(buildFace); }

        function slideRowLTR(ids, row, done) {
            ids.forEach(id => {
                const sz=FACE_CFG[id].cell, s0=rStrips[id][row][0], s1=rStrips[id][row][1];
                const old0=rState[id][row*2], old1=rState[id][row*2+1];
                s0.blocks[0].style.background=WH;  s0.blocks[1].style.background=old0; s0.blocks[2].style.background=old1;
                s1.blocks[0].style.background=old0; s1.blocks[1].style.background=old1; s1.blocks[2].style.background=WH;
                s0.el.style.transition='none'; s1.el.style.transition='none';
                s0.el.style.transform='translateX(-'+sz+'px)'; s1.el.style.transform='translateX(-'+sz+'px)';
                void s0.el.offsetWidth;
                s0.el.style.transition='transform 0.5s cubic-bezier(0.76,0,0.24,1)';
                s1.el.style.transition='transform 0.5s cubic-bezier(0.76,0,0.24,1)';
                s0.el.style.transform='translateX(0px)'; s1.el.style.transform='translateX(0px)';
                rState[id][row*2]=WH; rState[id][row*2+1]=old0;
                setTimeout(()=>{
                    s0.blocks[0].style.background=WH; s0.blocks[1].style.background=rState[id][row*2]; s0.blocks[2].style.background=WH;
                    s1.blocks[0].style.background=WH; s1.blocks[1].style.background=rState[id][row*2+1]; s1.blocks[2].style.background=WH;
                    s0.el.style.transition='none'; s1.el.style.transition='none';
                    s0.el.style.transform='translateX(-'+sz+'px)'; s1.el.style.transform='translateX(-'+sz+'px)';
                },550);
            });
            if(done) rw(600,done);
        }

        function slideRowRTL(ids, row, done) {
            ids.forEach(id => {
                const sz=FACE_CFG[id].cell, s0=rStrips[id][row][0], s1=rStrips[id][row][1];
                const old0=rState[id][row*2], old1=rState[id][row*2+1];
                s0.blocks[0].style.background=WH;  s0.blocks[1].style.background=old0; s0.blocks[2].style.background=old1;
                s1.blocks[0].style.background=old1; s1.blocks[1].style.background=old1; s1.blocks[2].style.background=WH;
                s0.el.style.transition='none'; s1.el.style.transition='none';
                s0.el.style.transform='translateX(-'+sz+'px)'; s1.el.style.transform='translateX(-'+sz+'px)';
                void s0.el.offsetWidth;
                s0.el.style.transition='transform 0.5s cubic-bezier(0.76,0,0.24,1)';
                s1.el.style.transition='transform 0.5s cubic-bezier(0.76,0,0.24,1)';
                s0.el.style.transform='translateX(-'+(sz*2)+'px)'; s1.el.style.transform='translateX(-'+(sz*2)+'px)';
                rState[id][row*2]=old1; rState[id][row*2+1]=WH;
                setTimeout(()=>{
                    s0.blocks[0].style.background=WH; s0.blocks[1].style.background=rState[id][row*2]; s0.blocks[2].style.background=WH;
                    s1.blocks[0].style.background=WH; s1.blocks[1].style.background=rState[id][row*2+1]; s1.blocks[2].style.background=WH;
                    s0.el.style.transition='none'; s1.el.style.transition='none';
                    s0.el.style.transform='translateX(-'+sz+'px)'; s1.el.style.transform='translateX(-'+sz+'px)';
                },550);
            });
            if(done) rw(600,done);
        }

        function allWhite(ids){return ids.every(id=>rState[id].every(c=>c===WH));}

        function conveyor(ids,done){
            let step=0;
            function tick(){
                if(allWhite(ids)){done&&done();return;}
                if(step%2===0) slideRowLTR(ids,0,null);
                else           slideRowRTL(ids,1,null);
                step++; rw(900,tick);
            }
            tick();
        }

        function initRubik(){
            stopRubik(); buildAll();

            // One step of the conveyor: alternates LTR row0 / RTL row1
            function ctStep(step, done) {
                if(step%2===0) slideRowLTR(['ct'],0,done);
                else           slideRowRTL(['ct'],1,done);
            }
            function outerStep(step, done) {
                if(step%2===0) slideRowLTR(ROUTER,0,done);
                else           slideRowRTL(ROUTER,1,done);
            }

            // Run: ct does one step, then outer follow with same step, repeat until ct all-white
            function runLinked(step) {
                if(allWhite(['ct'])){ rw(800, restart); return; }
                ctStep(step, ()=>{
                    rw(100, ()=>{
                        outerStep(step, ()=>{
                            rw(300, ()=>runLinked(step+1));
                        });
                    });
                });
            }

            function restart(){ buildAll(); rw(600, ()=>runLinked(0)); }
            rw(600, ()=>runLinked(0));
        }

                // Tutor art scatter animation on mouseleave
        function bindTutorArtScatter() {
            ['choice-tutor-art', 'form-tutor-art'].forEach(id => {
                const art = document.getElementById(id);
                if (!art) return;
                const panel = art.closest('.reg-choice-panel, .reg-tutor');
                if (!panel) return;
                panel.addEventListener('mouseleave', () => art.classList.add('scatter'));
                panel.addEventListener('mouseenter', () => art.classList.remove('scatter'));
            });
        }
        bindTutorArtScatter();
        // Re-bind after form is shown since elements are hidden/shown dynamically
        const _origShowRegForm = showRegForm;
        showRegForm = function(role) {
            _origShowRegForm(role);
            setTimeout(bindTutorArtScatter, 50);
        };
