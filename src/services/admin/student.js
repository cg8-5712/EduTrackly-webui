import ApiPrefix from '@/utils/ApiPrefix';

class StudentAdminService extends ApiPrefix {
  constructor() {
    super();
  }

  // 批量添加学生
  async addStudents(cid, students) {
    try {
      if (!cid) throw new Error('班级ID必填');
      if (!Array.isArray(students) || students.length === 0) {
        throw new Error('学生数据不能为空');
      }

      // 为每个学生添加 cid 字段
      const studentsWithCid = students.map(student => ({
        cid: cid,
        student_name: student.student_name,
        attendance: student.attendance
      }));

      const data = await this.adminPost('/student/add', studentsWithCid);
      console.log('批量添加学生:', data.message);

      if (data.code !== 0) {
        throw new Error(data.message || '添加学生失败');
      }

      return data;
    } catch (error) {
      console.error('批量添加学生失败:', error);
      // 重新抛出错误，保留原始错误消息
      throw new Error(error.message || '添加学生失败');
    }
  }

  // 添加单个学生
  async addSingleStudent(cid, studentName, attendance = true) {
    const studentData = [{
      student_name: studentName,
      attendance: attendance
    }];
    return this.addStudents(cid, studentData);
  }

  // 更改学生出勤状态
  async changeAttendance(sid, attendance) {
    try {
      if (!sid) throw new Error('学生ID必填');

      const data = await this.adminPut(`/student/attendance-change?sid=${sid}&attendance=${attendance}`);
      console.log('更改出勤状态:', data.message);

      if (data.code !== 0) {
        throw new Error(data.message || '更改出勤状态失败');
      }

      return data;
    } catch (error) {
      console.error('更改出勤状态失败:', error);
      throw new Error(error.message || '更改出勤状态失败');
    }
  }

  // 删除学生
  async deleteStudent(sid) {
    try {
      if (!sid) throw new Error('学生ID必填');

      const data = await this.adminDelete(`/student/delete?sid=${sid}`);
      console.log('删除学生:', data.message);

      if (data.code !== 0) {
        throw new Error(data.message || '删除学生失败');
      }

      return data;
    } catch (error) {
      console.error('删除学生失败:', error);
      throw new Error(error.message || '删除学生失败');
    }
  }

  // 提交学生事件
  async submitStudentEvents(events, date) {
    try {
      if (!date) throw new Error('日期必填');
      if (!Array.isArray(events) || events.length === 0) {
        throw new Error('事件数据不能为空');
      }

      const url = `/student/event?date=${date}`;
      const data = await this.adminPut(url, events);
      console.log('提交学生事件:', data.message);

      if (data.code !== 0) {
        throw new Error(data.message || '提交学生事件失败');
      }

      return data;
    } catch (error) {
      console.error('提交学生事件失败:', error);
      throw new Error(error.message || '提交学生事件失败');
    }
  }

  // 获取学生分析数据
  async getStudentAnalysis(sid, startDate = null, endDate = null) {
    try {
      if (!sid) throw new Error('学生ID必填');

      let url = `/analysis/student?sid=${sid}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const data = await this.adminGet(url);
      console.log('获取学生分析数据:', data.message);

      if (data.code !== 0) {
        throw new Error(data.message || '获取学生分析数据失败');
      }

      return data;
    } catch (error) {
      console.error('获取学生分析数据失败:', error);
      throw new Error(error.message || '获取学生分析数据失败');
    }
  }

  // 验证学生数据
  validateStudentData(students) {
    const validStudents = [];
    const errors = [];

    students.forEach((student, index) => {
      if (!student.student_name || !student.student_name.trim()) {
        errors.push(`第${index + 1}个学生姓名不能为空`);
        return;
      }

      const trimmedName = student.student_name.trim();
      if (trimmedName.length > 50) {
        errors.push(`第${index + 1}个学生姓名不能超过50个字符`);
        return;
      }

      validStudents.push({
        student_name: trimmedName,
        attendance: student.attendance !== undefined ? student.attendance : true
      });
    });

    return {
      isValid: errors.length === 0,
      validStudents,
      errors
    };
  }
}

export default new StudentAdminService();