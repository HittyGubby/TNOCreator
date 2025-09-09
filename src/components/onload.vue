<script>
import { Edittext } from './index.vue';

import { GetData, SetData } from '@/components/index.vue';

export function initApp() {
  let observer = new MutationObserver(() => { sessionStorage.setItem('data', JSON.stringify(GetData())); });
  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('text')) { Edittext(event); }
  });

  if (sessionStorage.getItem('data') != null) {
    SetData(JSON.parse(sessionStorage.getItem('data')));
  }
}
</script>
