function addCheckpoint(){
            
    window.location.href = '/checkpoint/add';
}
function cancelAddCheckpoint(){
    
    window.location.href = '/checkpoint';
}

function addBeacon(){
            
    window.location.href = '/beacon/add';
}
function cancelAddBeacon(){
    
    window.location.href = '/beacon';
}

var reloading;

function checkReloading() {
    if (window.location.hash=="#autoreload") {
        reloading=setTimeout("window.location.reload();", 5000);
        document.getElementById("reloadCB").checked=true;
    }
}

function toggleAutoRefresh(cb) {
    if (cb.checked) {
        window.location.replace("#autoreload");
        reloading=setTimeout("window.location.reload();", 5000);
    } else {
        window.location.replace("#");
        clearTimeout(reloading);
    }
}

window.onload=checkReloading;