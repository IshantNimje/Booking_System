document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("bookingForm");
    const availableRooms = {
        A: 10,
        B: 6,
        C: 20
    };
    const bookingsTable = document.getElementById("bookingsTable");
    const successMessage = document.getElementById("successMessage");

    function updateAvailableRooms() {
        document.getElementById("capacityA").innerText = availableRooms.A;
        document.getElementById("capacityB").innerText = availableRooms.B;
        document.getElementById("capacityC").innerText = availableRooms.C;
    }

    function addBookingToTable(id, room, date, startTime, endTime, title) {
        const row = bookingsTable.insertRow();
        row.id = id;
        row.insertCell(0).innerText = room;
        row.insertCell(1).innerText = date;
        row.insertCell(2).innerText = startTime;
        row.insertCell(3).innerText = endTime;
        row.insertCell(4).innerText = title;
        const actionsCell = row.insertCell(5);

        const editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.classList.add("btn", "btn-warning", "mr-2");
        editButton.addEventListener("click", () => editBooking(row, room, date, startTime, endTime, title));
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.addEventListener("click", () => deleteBooking(row, room));
        actionsCell.appendChild(deleteButton);
    }

    function editBooking(row, room, date, startTime, endTime, title) {
        document.getElementById("room").value = room;
        document.getElementById("date").value = date;
        document.getElementById("startTime").value = startTime;
        document.getElementById("endTime").value = endTime;
        document.getElementById("title").value = title;
        document.getElementById("editingRowId").value = row.id;

        availableRooms[room]++;
        bookingsTable.deleteRow(row.rowIndex - 1);
        updateAvailableRooms();
    }

    function deleteBooking(row, room) {
        availableRooms[room]++;
        bookingsTable.deleteRow(row.rowIndex - 1);
        updateAvailableRooms();
    }

    function isTimeSlotAvailable(room, date, startTime, endTime) {
        for (let i = 0; i < bookingsTable.rows.length; i++) {
            const row = bookingsTable.rows[i];
            const bookedRoom = row.cells[0].innerText;
            const bookedDate = row.cells[1].innerText;
            const bookedStartTime = row.cells[2].innerText;
            const bookedEndTime = row.cells[3].innerText;

            if (room === bookedRoom && date === bookedDate) {
                if ((startTime >= bookedStartTime && startTime < bookedEndTime) || 
                    (endTime > bookedStartTime && endTime <= bookedEndTime) || 
                    (startTime <= bookedStartTime && endTime >= bookedEndTime)) {
                    return false;
                }
            }
        }
        return true;
    }

    function showSuccessMessage(message) {
        successMessage.innerText = message;
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }

    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const room = document.getElementById("room").value;
        const date = document.getElementById("date").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;
        const title = document.getElementById("title").value;
        const editingRowId = document.getElementById("editingRowId").value;

        if (editingRowId) {
            const existingRow = document.getElementById(editingRowId);
            if (existingRow) {
                deleteBooking(existingRow, existingRow.cells[0].innerText);
                showSuccessMessage("Booking has been updated successfully.");
            }
        }

        if (availableRooms[room] > 0 && isTimeSlotAvailable(room, date, startTime, endTime)) {
            availableRooms[room]--;
            addBookingToTable(editingRowId || Date.now(), room, date, startTime, endTime, title);
            updateAvailableRooms();
        } else {
            alert("No rooms available in this category or time slot is already booked.");
        }

        bookingForm.reset();
        document.getElementById("editingRowId").value = "";
    });

    updateAvailableRooms();
});
