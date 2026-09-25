/* LaBarre Galleries — photo upload field (progressive enhancement for .upload) */
(function(){
function init(el){
  const max = +(el.dataset.max||8), mb = +(el.dataset.mb||10);
  el.innerHTML = '<label class="up-drop"><input type="file" accept="image/*" multiple><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="9" cy="10" r="1.8"></circle><path d="M21 16l-5-5-8 8"></path></svg><span class="up-t"><b>Add photos</b> or drag them here</span><span class="up-s">JPG, PNG or HEIC · up to '+max+' images, '+mb+' MB each</span></label><ul class="up-list"></ul><p class="up-err" role="alert"></p>';
  const input = el.querySelector('input'), drop = el.querySelector('.up-drop'), list = el.querySelector('.up-list'), err = el.querySelector('.up-err');
  let files = [];
  function render(){
    list.innerHTML = '';
    files.forEach(function(f,i){
      const li = document.createElement('li');
      const img = document.createElement('img'); img.src = f.url; img.alt = f.file.name;
      const x = document.createElement('button'); x.type='button'; x.setAttribute('aria-label','Remove '+f.file.name); x.innerHTML='&times;';
      x.onclick = function(){ URL.revokeObjectURL(f.url); files.splice(i,1); render(); };
      li.append(img,x); list.appendChild(li);
    });
    drop.classList.toggle('has', files.length>0);
  }
  function add(fl){
    err.textContent = '';
    Array.from(fl).forEach(function(file){
      if(!/^image\//.test(file.type)){ err.textContent = file.name+' is not an image.'; return; }
      if(file.size > mb*1048576){ err.textContent = file.name+' is over '+mb+' MB.'; return; }
      if(files.length >= max){ err.textContent = 'Up to '+max+' images.'; return; }
      files.push({file:file, url:URL.createObjectURL(file)});
    });
    render(); input.value='';
  }
  input.addEventListener('change', function(){ add(input.files); });
  ['dragenter','dragover'].forEach(function(e){ drop.addEventListener(e, function(ev){ ev.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave','drop'].forEach(function(e){ drop.addEventListener(e, function(ev){ ev.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function(ev){ add(ev.dataTransfer.files); });
}
document.addEventListener('DOMContentLoaded', function(){ document.querySelectorAll('.upload').forEach(init); });
})();
