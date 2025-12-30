import { ref, computed } from 'vue'

// 全局状态：当前管理员信息
const currentAdminRole = ref(null)
const managedClassIds = ref([]) // 可管理的班级 ID 列表
const isSuperAdmin = computed(() => currentAdminRole.value === 'superadmin')

/**
 * 管理员权限管理 Composable
 */
export function useAdminPermission() {
  /**
   * 设置管理员信息
   * @param {string} role - 管理员角色 ('superadmin' 或 'admin')
   * @param {Array} classes - 可管理的班级列表（superadmin 为 null）
   */
  const setAdminInfo = (role, classes) => {
    currentAdminRole.value = role

    // superadmin 可以管理所有班级，classes 为 null
    // 普通 admin 只能管理分配的班级
    if (role === 'superadmin' || !classes) {
      managedClassIds.value = [] // 空数组表示可以管理所有班级
    } else {
      managedClassIds.value = classes.map(c => c.cid)
    }
  }

  /**
   * 清空管理员信息
   */
  const clearAdminInfo = () => {
    currentAdminRole.value = null
    managedClassIds.value = []
  }

  /**
   * 检查是否可以管理指定班级
   * @param {number} cid - 班级 ID
   * @returns {boolean}
   */
  const canManageClass = (cid) => {
    // superadmin 可以管理所有班级
    if (isSuperAdmin.value) {
      return true
    }

    // 普通 admin 检查班级是否在可管理列表中
    return managedClassIds.value.includes(cid)
  }

  /**
   * 过滤班级列表，只保留可管理的班级
   * @param {Array} classList - 完整的班级列表
   * @returns {Array} - 过滤后的班级列表
   */
  const filterManagedClasses = (classList) => {
    // superadmin 可以看到所有班级
    if (isSuperAdmin.value) {
      return classList
    }

    // 普通 admin 只能看到分配的班级
    if (!Array.isArray(classList)) {
      return []
    }

    return classList.filter(classItem =>
      managedClassIds.value.includes(classItem.cid)
    )
  }

  return {
    // 状态
    currentAdminRole,
    managedClassIds,
    isSuperAdmin,

    // 方法
    setAdminInfo,
    clearAdminInfo,
    canManageClass,
    filterManagedClasses
  }
}
