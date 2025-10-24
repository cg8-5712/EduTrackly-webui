import ApiPrefix from '@/utils/ApiPrefix';
import i18n from '@/i18n';

const t = (key) => i18n.global.t(key);

class StudentAdminService extends ApiPrefix {
  constructor() {
    super();
  }

  // 批量添加学生
  async addStudents(cid, students) {
    try {
      if (!cid) throw new Error(t('error.classIdRequired'));
      if (!Array.isArray(students) || students.length === 0) {
        throw new Error(t('error.studentDataEmpty'));
      }

      // 为每个学生添加 cid 字段
      const studentsWithCid = students.map(student => ({
        cid: cid,
        student_name: student.student_name,
        attendance: student.attendance
      }));

      const data = await this.adminPost('/student/add', studentsWithCid);
      console.log(t('service.batchAddingStudents') + ':', data.message);

      if (data.code !== 0) {
        throw new Error(data.message || t('notification.addFailed'));
      }

      return data;
    } catch (error) {
      console.error(t('service.batchAddStudentsFailed') + ':', error);
      // 重新抛出错误，保留原始错误消息
      throw new Error(error.message || t('notification.addFailed'));
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
      if (!sid) throw new Error(t('error.studentIdRequired'));

      const data = await this.adminPut(`/student/attendance-change?sid=${sid}&attendance=${attendance}`);
      console.log(t('service.changingAttendanceStatus') + ':', data.message);

      if (data.code !== 0) {
        throw new Error(data.message || t('service.changeAttendanceStatusFailed'));
      }

      return data;
    } catch (error) {
      console.error(t('service.changeAttendanceStatusFailed') + ':', error);
      throw new Error(error.message || t('service.changeAttendanceStatusFailed'));
    }
  }

  // 删除学生
  async deleteStudent(sid) {
    try {
      if (!sid) throw new Error(t('error.studentIdRequired'));

      const data = await this.adminDelete(`/student/delete?sid=${sid}`);
      console.log(t('service.deletingStudent') + ':', data.message);

      if (data.code !== 0) {
        throw new Error(data.message || t('service.deleteStudentFailed'));
      }

      return data;
    } catch (error) {
      console.error(t('service.deleteStudentFailed') + ':', error);
      throw new Error(error.message || t('service.deleteStudentFailed'));
    }
  }

  // 提交学生事件
  async submitStudentEvents(events, date) {
    try {
      if (!date) throw new Error(t('error.dateRequired'));
      if (!Array.isArray(events) || events.length === 0) {
        throw new Error(t('error.eventDataEmpty'));
      }

      const url = `/student/event?date=${date}`;
      const data = await this.adminPut(url, events);
      console.log(t('service.submittingStudentEvents') + ':', data.message);

      if (data.code !== 0) {
        throw new Error(data.message || t('service.submitStudentEventsFailed'));
      }

      return data;
    } catch (error) {
      console.error(t('service.submitStudentEventsFailed') + ':', error);
      throw new Error(error.message || t('service.submitStudentEventsFailed'));
    }
  }

  // 获取学生分析数据
  async getStudentAnalysis(sid, startDate = null, endDate = null) {
    try {
      if (!sid) throw new Error(t('error.studentIdRequired'));

      let url = `/analysis/student?sid=${sid}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const data = await this.adminGet(url);
      console.log(t('service.gettingStudentAnalysis') + ':', data.message);

      if (data.code !== 0) {
        throw new Error(data.message || t('service.getStudentAnalysisFailed'));
      }

      return data;
    } catch (error) {
      console.error(t('service.getStudentAnalysisFailed') + ':', error);
      throw new Error(error.message || t('service.getStudentAnalysisFailed'));
    }
  }

  // 验证学生数据
  validateStudentData(students) {
    const validStudents = [];
    const errors = [];

    students.forEach((student, index) => {
      if (!student.student_name || !student.student_name.trim()) {
        errors.push(t('error.studentNameEmpty', { index: index + 1 }));
        return;
      }

      const trimmedName = student.student_name.trim();
      if (trimmedName.length > 50) {
        errors.push(t('error.studentNameTooLong', { index: index + 1 }));
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