import ApiPrefix from '@/utils/ApiPrefix';

class StudentService extends ApiPrefix {
  constructor() {
    super();
  }

  // 获取指定班级的完整学生列表（不分页，返回所有学生）
  async getStudentListAll(cid) {
    try {
      if (!cid) throw new Error('班级ID必填');

      // 第一步：获取总数
      const first = await this.get('/student/list', {
        cid: cid,
        page: 1,
        size: 1
      });

      console.log('获取完整学生列表第一步响应:', first);

      if (first.code !== 0) {
        throw new Error(first.message || '获取学生列表失败');
      }

      const total = first.pagination?.total || 0;
      if (total === 0) return { data: [], total: 0 };

      // 第二步：获取完整列表
      const second = await this.get('/student/list', {
        cid: cid,
        page: 1,
        size: total
      });

      console.log('获取完整学生列表第二步响应:', second);

      if (second.code !== 0) {
        throw new Error(second.message || '获取学生列表失败');
      }

      return second;
    } catch (error) {
      console.error('获取完整学生列表错误:', error);
      throw error;
    }
  }

  // 获取分页学生列表
  async getStudentList(cid, page = 1, size = 20) {
    try {
      if (!cid) throw new Error('班级ID必填');

      const data = await this.get('/student/list', {
        cid: cid,
        page: page,
        size: size
      });

      console.log('获取分页学生列表响应:', data);

      if (data.code !== 0) {
        throw new Error(data.message || '获取分页学生列表失败');
      }

      return data;
    } catch (error) {
      console.error('获取分页学生列表失败:', error);
      throw error;
    }
  }

  // 获取单个学生信息
  async getStudentInfo(sid = null, studentName = null) {
    try {
      let url = '/student/get?';
      if (sid) url += `sid=${sid}`;
      if (studentName) url += `${sid ? '&' : ''}student_name=${encodeURIComponent(studentName)}`;

      const data = await this.api.get(url);
      console.log('获取学生信息:', data.data.message);

      if (data.data.code !== 0) {
        throw new Error(data.data.message);
      }

      return data;
    } catch (error) {
      console.error('获取学生信息失败:', error);
      throw error;
    }
  }

  // 批量添加学生
  async addStudents(cid, students) {
    try {
      if (!cid) throw new Error('班级ID必填');
      if (!Array.isArray(students) || students.length === 0) {
        throw new Error('学生数据不能为空');
      }

      const data = await this.api.post(`/student/add?cid=${cid}`, students);
      console.log('批量添加学生:', data.data.message);

      if (data.data.code !== 0) {
        throw new Error(data.data.message);
      }

      return data;
    } catch (error) {
      console.error('批量添加学生失败:', error);
      throw error;
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

      const data = await this.api.put(`/student/attendance-change?sid=${sid}&attendance=${attendance}`);
      console.log('更改出勤状态:', data.data.message);

      if (data.data.code !== 0) {
        throw new Error(data.data.message);
      }

      return data;
    } catch (error) {
      console.error('更改出勤状态失败:', error);
      throw error;
    }
  }

  // 删除学生
  async deleteStudent(sid) {
    try {
      if (!sid) throw new Error('学生ID必填');

      const data = await this.api.delete(`/student/delete?sid=${sid}`);
      console.log('删除学生:', data.data.message);

      if (data.data.code !== 0) {
        throw new Error(data.data.message);
      }

      return data;
    } catch (error) {
      console.error('删除学生失败:', error);
      throw error;
    }
  }

  // 获取学生分析数据
  async getStudentAnalysis(cid, startDate = null, endDate = null) {
    try {
      if (!cid) throw new Error('班级ID必填');

      let url = `/analysis/student?cid=${cid}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const data = await this.api.get(url);
      console.log('获取学生分析数据:', data.data.message);

      if (data.data.code !== 0) {
        throw new Error(data.data.message);
      }

      return data;
    } catch (error) {
      console.error('获取学生分析数据失败:', error);
      throw error;
    }
  }

  // 提交学生事件
  async submitStudentEvents(events) {
    try {
      const data = await this.api.put('/student/event', events);
      console.log('提交学生事件:', data.data.message);

      if (data.data.code !== 0) {
        throw new Error(data.data.message);
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
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

export default new StudentService();
