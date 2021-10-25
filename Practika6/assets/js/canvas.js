function canvas(selector, options){
    const canvas = document.querySelector(selector);
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`)

    const context = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect();

    let isPaint = false // чи активно малювання
    let points = [] //масив з точками

    // об’являємо функцію додавання точок в масив
    const addPoint = (x, y, dragging) => {
        // преобразуємо координати події кліка миші відносно canvas
        points.push({
            x: (x - rect.left),
            y: (y - rect.top),
            dragging: dragging
        })
    }

    // головна функція для малювання
    const redraw = () => {
        //очищуємо  canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        context.strokeStyle = options.strokeColor;
        context.lineJoin = "round";
        context.lineWidth = options.strokeWidth;
        let prevPoint = null;
        for (let point of points){
            context.beginPath();
            if (point.dragging && prevPoint){
                context.moveTo(prevPoint.x, prevPoint.y)
            } else {
                context.moveTo(point.x - 1, point.y);
            }
            context.lineTo(point.x, point.y)
            context.closePath()
            context.stroke();
            prevPoint = point;
        }
    }

    // функції обробники подій миші
    const mouseDown = event => {
        isPaint = true
        addPoint(event.pageX, event.pageY);
        redraw();
    }

    const mouseMove = event => {
        if(isPaint){
            addPoint(event.pageX, event.pageY, true);
            redraw();
        }
    }

// додаємо обробку подій
    canvas.addEventListener('mousemove', mouseMove)
    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('mouseup',() => {
        isPaint = false;
    });

    canvas.addEventListener('mouseleave',() => {
        isPaint = false;
    });
    const toolBar = document.getElementById('toolbar')

    // clear button
    const clearBtn = document.createElement('button')
    clearBtn.classList.add('btn')
    clearBtn.textContent = 'Clear'
    clearBtn.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    })
    toolBar.insertAdjacentElement('afterbegin', clearBtn)

    // time button
    const showTimeBtn = document.createElement('button');
    showTimeBtn.classList.add('btn')
    showTimeBtn.textContent = 'Time'
    showTimeBtn.addEventListener('click', () => {
        context.fillText(new Date().toDateString(), canvas.width - 200, canvas.height - 30)
    })
    toolBar.insertAdjacentElement('afterbegin', showTimeBtn)

    // color button
    const color_P = document.createElement('button');
    color_P.classList.add('btn')
    color_P.textContent = 'Color'
    color_P.addEventListener('click', () => {
        context.strokeStyle = colorPicker.value;
    });
    toolBar.insertAdjacentElement('afterbegin', color_P)

    // size button
    const sizeForm = document.createElement('button');
    sizeForm.classList.add('btn')
    sizeForm.textContent = 'Size'
    sizeForm.addEventListener('click', () => {
        context.lineWidth = sizeForm.value;
    })
    toolBar.insertAdjacentElement('afterbegin', sizeForm)

    // image button
    const imgBtn = document.createElement('button');
    imgBtn.classList.add('btn')
    imgBtn.textContent = 'Image'
    imgBtn.addEventListener('click', () => {
        const img = new Image;
        img.src =`https://www.fillmurray.com/200/300`;
        context.drawImage(img, 0, 0);
    })
    toolBar.insertAdjacentElement('afterbegin', imgBtn)

    // save button
    const saveBtn = document.createElement('button')
    saveBtn.classList.add('btn')
    saveBtn.textContent = 'Save'
    saveBtn.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        const newTab = window.open('about:blank','image from canvas');
        newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
    })
    toolBar.insertAdjacentElement('afterbegin', saveBtn)

}