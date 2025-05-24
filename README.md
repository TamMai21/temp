Đề bài 1: Ứng dụng quản lý công việc (Task Management App)
Nội dung ôn thi:
 Redux Toolkit, React Router
 Tailwind CSS, Hooks
 Custom Hook
 Fetch API
 JSON Server để tạo API
Bài ôn:
1. Giao diện & Routing (React Router + Tailwind CSS)
o Trang chính (/):
 Hiển thị danh sách công việc từ API (/tasks).
 Mỗi công việc hiển thị: tiêu đề, trạng thái (hoàn
thành/chưa hoàn thành), ngày tạo.
 Có nút "Chi tiết" điều hướng đến /task/:id.
o Trang chi tiết (/task/:id):
 Hiển thị đầy đủ thông tin công việc: tiêu đề, mô tả, trạng
thái, ngày tạo.
 Có nút "Quay lại" để trở về trang chính.
o Trang thêm mới (/add):
 Form thêm công việc mới với các trường: title, description,
status (boolean). Gửi dữ liệu lên JSON Server (POST).
 Điều hướng về trang chính sau khi thêm thành công.
o Trang chỉnh sửa (/edit/:id):
 Form cập nhật công việc theo ID.
 Load dữ liệu công việc từ API và cho phép chỉnh sửa (PUT).
 Điều hướng về trang chính sau khi cập nhật thành công.
2. Quản lý trạng thái với Redux Toolkit
o Thiết lập store với @reduxjs/toolkit.
o Quản lý danh sách công việc bằng slice (taskSlice).
o Sử dụng createAsyncThunk để gọi API.
3. Hooks & Custom Hook
o Tạo custom hook (useFetch) để xử lý logic gọi API:
 Nhận URL.
 Trả về data, loading, error.
4. Gọi API với Fetch
o Sử dụng fetch để thực hiện các thao tác: GET, POST, PUT,
DELETE đến http://localhost:3000/tasks.
5. Sử dụng JSON Server
o Tạo file db.json chứa mẫu dữ liệu ban đầu cho công việc:6. Bonus (Tùy chọn nếu còn thời gian):
o Tính năng xóa công việc.
o Hiển thị thông báo (success/error) khi thêm/sửa/xóa.
o Giao diện responsive với Tailwind CSS.
o Hiển thị loading spinner khi gọi API.



* đổi từ json server -> MockAPI: vào taskSlice.js đổi url 
* up ảnh vào json server thì chỉ lưu dc cái tên ảnh, muốn ảnh hiện đc phải bỏ vào public/img (cùng cấp src)