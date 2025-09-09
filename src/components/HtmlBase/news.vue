<script>
import { ref, onMounted } from 'vue';
import PicManager from '@/components/Controller/PicManager.vue';
export default {
    components: { PicManager },
    setup() {
        const picManagerVisible = ref(false);
        const picManagerType = ref('');
        const picManagerTargetId = ref('');
        const picManagerResizable = ref(false);
        let zIndexCounter = 10;

        const updatePicture = ({ id, url, scale }) => {
            const element = document.getElementById(id);
            if (element) {
                element.src = url ? url : element.src;
                if (scale !== undefined) {
                    element.style.scale = scale;
                }
            }
        };

        const handlePicClick = (event) => {
            const target = event.target;
            if (target.dataset.modifiable === 'true') {
                picManagerType.value = target.dataset.type;
                picManagerTargetId.value = target.dataset.targetId;
                picManagerResizable.value = target.dataset.resizable === 'true';
                picManagerVisible.value = true;
            }
        };

        const prioritizeWindow = (event) => {
            const target = event.target.closest('.draggable');
            if (target) {
                zIndexCounter++;
                target.style.zIndex = zIndexCounter;
            }
        };

        onMounted(() => {
            document.addEventListener('click', handlePicClick);
            const windowElement = document.getElementById('newswindow');
            windowElement.addEventListener('mousedown', prioritizeWindow);
        });

        return {
            picManagerVisible,
            picManagerType,
            picManagerTargetId,
            picManagerResizable,
            updatePicture
        };
    }
}
</script>

<template>
    <div class="draggable" id="newswindow" style="position: absolute; z-index: 4;">
        <img src="/template/news/event_news_bg.png" style="position: relative;">
        <div style="position:absolute;top: 140px; left: 28px;width: 160px; height: 420px;">
            <img id="newspic" class="pic" src="/preset/GER_german_civil_war.png"
                style="position:absolute; width: inherit;height: inherit;" data-modifiable="true" data-type="news"
                data-resizable="false" data-target-id="newspic">
        </div>
        <div style="position:absolute;top: 15px; left: 25px;width: 480px; height: 80px;">
            <img id="newsheaderpic" class="pic" src="/preset/nazist-Germany.png"
                style="position:absolute; width: inherit;height: inherit;" data-modifiable="true" data-type="newsheader"
                data-resizable="false" data-target-id="newsheaderpic">
        </div>
        <button id="newsbutton" class="button text"
            style="position:absolute; top: 500px; left: 180px;transition: 0.2s; background: url('/template/news/event_option_entry.png') no-repeat; border: none; width: 352px; height: 52px; font-family:electrolize,FZRui;font-size: 16px;color: #000000;">骨肉再次相残。</button>
        <div
            style="position:absolute;display: flex; left: 20px; top:125px; justify-content: center; align-items: center; inline-size: 500px;">
            <p id="newstitle" class="text"
                style="position: absolute;color: #000000; text-align: center; font-family: electrolize,FZRui; font-size: 20px;">
                国会拒绝交涉</p>
        </div>
        <span id="newsbody" class="text"
            style="font-family: electrolize,FZRui; position: absolute;left:200px; top:150px;color: #000000;inline-size: 300px;text-align: left; font-size: 15px;white-space: pre-line;">在阿道夫·希特勒去世后，德国旋即陷入混乱。尽管元首指定了合法的继任者，但德国国内的强大派系已经开始拿起武器，互相对抗，打算将国家引导向自己的期望。国家已被分裂，整支整支的驻军无视来自日耳曼尼亚的命令，并倒向他们选择的继任者。虽然局势的严重程度尚不清楚，但据估计，德国要么正在面临要么已经经历了中央权威的彻底崩溃。<br><br>
            虽然还不大清楚德国东部领地的命运将会如何，但日耳曼尼亚与她的殖民领之间突然断绝了联系，这已经引发了这些地区是否也会自行寻找出路的猜测。然而，有一点毫无疑问，这个欧洲巨人的崩溃已经使整个欧陆陷入分崩离析之中。</span>
    </div>
</template>
